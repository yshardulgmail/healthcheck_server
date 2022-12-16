import pandas as pd
 
dataframe2 = pd.read_excel("Book1.xlsx")
servers = list(dataframe2.columns.values)[1:]
insert_query = "insert into applications values(#id#, '#app_name#', '#app_url#', '#server#');"

queries = []
id = 1
for server in servers:
    for values in dataframe2[["Application", server]].values:
        queries.append(insert_query.replace("#app_name#", values[0])
                          .replace("#app_url#", values[1])
                          .replace("#server#", server)
                          .replace("#id#", str(id)))
        id = id + 1   

with open("insert_queries.txt", "w") as fp:
    fp.write("\n".join(queries))