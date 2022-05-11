from fastapi import FastAPI , File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import time
import random
import numpy as np
from deta import Deta
import matplotlib.pyplot as plt
import io
import requests

def survey(results, category_names):
    labels = list(results.keys())
    data = np.array(list(results.values()))
    data_cum = data.cumsum(axis=1)
    category_colors = plt.get_cmap('RdYlGn')(
        np.linspace(0.15, 0.85, data.shape[1]))

    fig, ax = plt.subplots(figsize=(19.2, 5))
    ax.invert_yaxis()
    ax.xaxis.set_visible(False)
    ax.set_xlim(0, np.sum(data, axis=1).max())

    for i, (colname, color) in enumerate(zip(category_names, category_colors)):
        widths = data[:, i]
        starts = data_cum[:, i] - widths
        ax.barh(labels, widths, left=starts, height=0.8,
                label=colname, color=color)
        xcenters = starts + widths / 2

        r, g, b, _ = color
        text_color = 'white' if r * g * b < 0.5 else 'darkgrey'
        for y, (x, c) in enumerate(zip(xcenters, widths)):
            ax.text(x, y, str(int(c)), ha='center', va='center',
                    color=text_color)
    ax.legend(ncol=len(category_names), bbox_to_anchor=(0, 1),
              loc='lower left', fontsize='small')

    return fig, ax



def sendS3(fig, namef):
        buf = io.BytesIO()
        fig.savefig(buf, format='png')
        buf.seek(0)
        url = 'https://6unsq6kj9f.execute-api.us-east-1.amazonaws.com/something/upload'
        data = buf.read()
        res = requests.post(url,
                    data=data,
                    headers={'Content-Type': 'application/octet-stream', 'file-name': namef})


def flatten(t):
    return [item for sublist in t for item in sublist]

def aggregate (df, x, y, conf):
    new= df.groupby(x)[y].mean().reset_index()
    print(new)
    new2= df.groupby([x,conf])[y].mean().reset_index()
    print(new2)
    return new,new2



def aggregate_adj (df, x, y, conf):
    res = df.groupby([x, conf])[y].mean().reset_index()
    new1= df.groupby(x)[y].count().reset_index()
    new2= df.groupby([x,conf])[y].count().reset_index()
    # print(new2.reset_index())
    # print(new1.reset_index())
    res["adj"]=1.5
    for index, row in res.iterrows():
        adj= new1[new1[x] == row[x]][y] /new2.loc[index][y]
        val= res.loc[index][y]/new2.loc[index][y]*new1[new1[x] == row[x]][y]
        res.at[index, y]=val
        res.at[index, 'adj'] = adj

    nom = res.groupby(x)[y].sum().reset_index()
    denom = res.groupby(x)['adj'].sum().reset_index()
    for index, row in nom.iterrows():
        val= nom.loc[index][y]/denom.loc[index]['adj']
        nom.at[index,y]=val
    print(nom)
    return nom


def bool_to_str(pandasDF,y):
    
    dd=pandasDF.copy()
    columns1 = pandasDF.columns[pandasDF.nunique() > 1]
    pandasDF=pandasDF[columns1]
    # pandasDF = pandasDF[[c for c
    #    in list(pandasDF)
    #    if len(pandasDF[c].unique()) > 1]]
    booleandf = pandasDF.select_dtypes(include=[bool])
    booleanDictionary = {True: 'TRUE', False: 'FALSE'}

    for column in booleandf:
        pandasDF[column] = pandasDF[column].map(booleanDictionary)
    columns = pandasDF.columns[pandasDF.nunique() <= 4]
    num_cols = pandasDF.select_dtypes([np.number]).columns
    print(columns)
    for column in columns:
        if(column != y and column in num_cols):
            pandasDF[column] = pandasDF[column].map({0: '0', 1: '1', 2: '2',3: '3'})
            
    return pandasDF


def cat_cat(data , x, y):
    valsx=data[x].unique()
    valsy=data[y].unique()
    data[x] = data[x].replace({valsx[0]: 0, valsx[1]: 1})
    data[y] = data[y].replace({valsy[0]: 0, valsy[1]: 1})
    return data

def cat_num(data , x):
    valsx=data[x].unique()
    data[x] = data[x].replace({valsx[0]: 0, valsx[1]: 1})
    return data

def reverse_cat_num(data_copy,data , x):
    valsx=data_copy[x].unique()
    data[x] = data[x].replace({0: valsx[0], 1: valsx[1]})
    return data


def find_conf(df,x,y):
    results=[]
    temps= dict()
    rM = np.corrcoef(df[x], df[y])[0][1]
    print(rM)
    cols=df.loc[:, ~df.columns.isin([x, y])].columns
    num_cols=df._get_numeric_data().columns
    pots=list(set(cols) - set(num_cols))
    for col in pots:
      vals=df[col].unique()
      print(vals)
      num_vals=len(df[col].unique())
      if(num_vals >10):
        continue
      coefs = []
      for val in vals:
        f=df[ df[col] == val]
        #print(f)
        if (f.shape[0] <3):
          coefs.append(-1)
          continue
        r = np.corrcoef(f[x], f[y])[0][1]
        coefs.append(r)
        #print(r)
      if ((all(i > 0 for i in coefs) and rM <= 0) or (all(i < 0 for i in coefs) and rM >= 0)):
              print(col)
              print("Simpson Paradox holds for this dataset \n")
              print(coefs)
              results.append((col, 1))
              temps[col]=vals
      else:
              if (rM> 0):
                print("\n Number of reversed subgroups ")
                print(sum(1 for i in coefs if i <= 0)/num_vals)
                results.append((col,sum(1 for i in coefs if i <= 0)/num_vals))
                temps[col]=[ x for ind,x in enumerate(vals) if  coefs[ind]<= 0]
              elif (rM < 0):
                print("\n Number of reversed subgroups ")
                print(sum(1 for i in coefs if i >= 0)/num_vals)
                results.append((col, sum(1 for i in coefs if i >= 0)/num_vals))
                temps[col]= [ x for ind,x in enumerate(vals) if  coefs[ind]>= 0]
              else:
                print("\n Number of reversed subgroups ")
                print(sum(1 for i in coefs if i != 0)/num_vals)
                results.append((col, sum(1 for i in coefs if i != 0)/num_vals))
                temps[col]= [ x for ind,x in enumerate(vals) if  coefs[ind]!= 0]

    con = max(results , key = lambda x: x[1])
    
    return (con[0],con[1],temps[con[0]])





# initialize with a project key
deta = Deta("a0mb0ech_YcgBPTBcwBfdnLhSV3jg5zaDgQe3qRPW")
photos = deta.Drive("photos")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Add a simple GET response at the base url "/"
@app.get("/")
def read_root():
    return {"test_response": "Hello World!"}


@app.post('/dropdown/')
async def dropdown(
        data_file: UploadFile = File(...),):
    data = pd.read_csv(data_file.file)
    data = data.dropna()
    data= bool_to_str(data,'nnnn')
    cols = data.columns
    num_cols = data._get_numeric_data().columns
    pots = list(set(cols) - set(num_cols))
    final_cats = dict()
    for col in pots:
        vals = data[col].unique()
        print(vals)
        num_vals = len(data[col].unique())
        if (num_vals > 10):
            continue
        final_cats[col] = list(vals)
    return {
        'columns': json.dumps(list(cols)).replace("\'", '"'),
        'column_values': json.dumps(final_cats).replace("\'", '"')
    }

@app.post('/uploadfile/')
async def create_data_file(
        experiment: str = Form(...),
        data_file: UploadFile = File(...),
):
    # decoded = base64.b64decode(data_file.file)
    # decoded = io.StringIO(decoded.decode('utf-8'))

    print(pd.read_csv(data_file.file))

    return {'filename': data_file.filename,
            'experiment': experiment}


@app.post('/confounder/')
async def find_confounder(
        x: str = Form(...),
        y: str = Form(...),
        x1: str = Form(...),
        x2: str = Form(...),
        data_file: UploadFile = File(...),):

    data = pd.read_csv(data_file.file)
    data = data.dropna()
    # x = input("enter x var name : ")
    # y = input("enter y var name : ")
    data_copy = data.copy()
    data = bool_to_str(data,y)
    flag=0

    if(type(data[x][0]) == str and type(data[y][0]) == str ):
        if (data[x].nunique() > 2):
            flag=1
            cats=[]
            cats1 = x1
            if cats1:
               cats2 = x2
               cats.append(cats1)
               cats.append(cats2)
               data = data[data[x].apply(lambda x: x in cats)]
               data_copy = data_copy[data_copy[x].apply(lambda x: x in cats)]
        flag=1       
        data=cat_cat(data,x,y)
    elif(type(data[x][0]) == str and type(data[y][0]) != str ):
        if (data[x].nunique() > 2):
            flag=1
            cats=[]
            cats1 =x1
            if cats1:
               cats2 = x2
               cats.append(cats1)
               cats.append(cats2)
               data = data[data[x].apply(lambda x: x in cats)]
               data_copy = data_copy[data_copy[x].apply(lambda x: x in cats)]
        flag=1       
        data = cat_num(data, x)

    conf,prop,revs = find_conf(data,x,y)
    #js = data.to_json(orient='index')

    if (flag ==0):
        # plt.plot(df['culmen_length_mm'], df['culmen_depth_mm'])
        fig, ax = plt.subplots()
        plt.rcParams["figure.figsize"] = (20,12)
        m, b = np.polyfit(data_copy[x], data_copy[y], 1)
        ax.plot(data_copy[x], m*data_copy[x] + b,color='black', label='all')
        colors=['green' , 'blue' , 'red','black']
        plt.xlabel(x)
        plt.ylabel(y)
        for i,col in enumerate(data_copy[conf].unique()):
          qf=data_copy[data_copy[conf]==col]
          ax.scatter(qf[x], qf[y], color=colors[i],label = col, s = 70)
          m, b = np.polyfit(qf[x], qf[y], 1)
          ax.plot(qf[x], m*qf[x] + b,color=colors[i],label=col)
        ax.legend()
        namef=conf+x+y+'.png' # name of file 
        sendS3(fig, namef) # Sending photo to AWS S3 to save and later use in source component
        return  {
                'response': 'https://huseynphotos.s3.eu-north-1.amazonaws.com/'+namef,
                'confounding_variable': conf,
                'reversed_params': prop,
                'revs': list(revs)
                }

    agg_data, disagg_data = aggregate(data,x,y,conf)
    agg_data, disagg_data = json.loads(json.dumps(reverse_cat_num(data_copy,agg_data,x).to_dict(orient='records'))), json.loads(json.dumps(reverse_cat_num(data_copy,disagg_data,x).to_dict(orient='records')))
    fixed_agg_data = aggregate_adj(data,x,y,conf)
    fixed_agg_data = json.loads(json.dumps(reverse_cat_num(data_copy,fixed_agg_data,x).to_dict(orient='records')))

    conf_vals=data_copy[conf].unique()
    dyI=dict()
    # dyF =dict()
    for v in data_copy[x].unique():
      tdf=data_copy[data_copy[x] ==v]
      temp=[ tdf[tdf[conf] ==i].size for i in conf_vals]
      # s=sum(temp)
      # tempF=[s/x*x for x in temp]
      dyI[v]=temp
      # dyF[v]=tempF
    fig,ax= survey(dyI,list(conf_vals))
    namef=conf+x+y+x1+x2+'I'+'.png'
    sendS3(fig, namef) # Sending photo to AWS S3 to save and later use in source component
    return {
            'dist': 'https://huseynphotos.s3.eu-north-1.amazonaws.com/'+namef,
            'confounding_variable': conf,
            'reversed_params' : prop,
            'agg_data': agg_data,
            'disagg_date': disagg_data,
            'fixed_agg_data': fixed_agg_data,
            'revs': list(revs)
            }
