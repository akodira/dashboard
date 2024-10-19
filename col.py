import pandas as pd
import plotly.express as px
import streamlit as st

st.set_page_config(layout='wide')
st.title("Tips Analysis!!!")


df = px.data.tips()

col1, col2 = st.columns(2)

with col1:
    st.plotly_chart(px.histogram(df, x='total_bill', y='sex', text_auto=True))
    st.plotly_chart(px.pie(df, names='sex', values='total_bill'))
    
with col2:
    st.plotly_chart(px.bar(df, x='day', y='total_bill', text_auto=True))
    st.plotly_chart(px.histogram(df, x='smoker', y='total_bill', text_auto=True))
