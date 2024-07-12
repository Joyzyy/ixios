from pb.statistics_pb2 import StatisticsDataType
from statsmodels.formula.api import ols
import statsmodels.api as sm
import pandas as pd
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io
import seaborn as sns
from scipy.stats import norm
import numpy as np
import scipy.stats as scipy
import math

def transform_equation(new_data, if_specific):
    equations = if_specific.get('equations', [])
    if equations:
        for equation in equations:
            for i_eq in equation:
                if i_eq['transformation'] == 'sqrt':
                    new_data[i_eq['row']] = new_data[i_eq['row']].apply(lambda x: x ** 0.5)
                elif i_eq['transformation'] == 'log':
                    new_data[i_eq['row']] = new_data[i_eq['row']].apply(lambda x: math.log(x))
                elif i_eq['transformation'] == 'diff':    
                    new_data[i_eq['row']] = np.gradient(new_data[i_eq['row']])

def calculate_ols(data: StatisticsDataType, if_specific: dict):
    data_dict = {}
    for item in data:
        data_dict[item.row] = list(item.values)
    new_data = pd.DataFrame.from_dict(data_dict, orient='index').T
    transform_equation(new_data, if_specific)

    dependent_var = "Y" if "Y" in data_dict else sorted(data_dict.keys())[0]
    independent_vars = [key for key in data_dict.keys() if key != dependent_var]
    ols_model = sm.OLS(new_data[dependent_var], sm.add_constant(new_data[independent_vars])).fit()

    try:
        t1 = (ols_model.summary().tables[0])
        t2 = (ols_model.summary().tables[1])
        t3 = (ols_model.summary().tables[2])
    except Exception as e:
        print(f'error: {e}')

    t1, t2, t3 = t1.as_html(), t2.as_html(), t3.as_html()
    t = f'{t1}{t2}{t3}'

    try:
        part_reg_plot = sm.graphics.plot_partregress_grid(ols_model)
        part_reg_plot.tight_layout(pad=1.0)
        plt_IOBytes = io.BytesIO()
        part_reg_plot.savefig(plt_IOBytes, format='png')
        plt.clf()
        plt.cla()
        plt_IOBytes.seek(0)
        part_reg_plot_hash = base64.b64encode(plt_IOBytes.read()).decode('utf-8')
    except Exception as e:
        print(f'error: {e}')
        influence_plot_hash, part_reg_plot_hash = -1, -1

    return json.dumps({
        "data": t,
        "html": True
    }), json.dumps({
        "label": "Partial Regression Plots (Duncan)",
        "data": f"data:image/png;base64,{part_reg_plot_hash}"
    }), ols_model

def calculate_anova(data: StatisticsDataType, if_specific: dict):
    data_dict = {}
    for item in data:
        for value in item.values:
            if item.row in data_dict:
                data_dict[item.row].append(value)
            else:
                data_dict[item.row] = [value]
    formatted_data = []
    for group, values in data_dict.items():
        for value in values:
            formatted_data.append({
                "Values": value,
                "Group": group
            })
    df = pd.DataFrame(formatted_data)
    try:
        ols_model = ols('Values ~ Group', data=df).fit()
        anova_lm = sm.stats.anova_lm(ols_model, typ=1 if len(data_dict.keys()) <= 2 else 2)
        
        plt.figure(figsize=(10, 6))
        sns.boxplot(x='Group', y='Values', data=df)
        plt.title("Boxplot of Values by Group")
        plt_IOBytes = io.BytesIO()
        plt.savefig(plt_IOBytes, format='png')
        plt_IOBytes.seek(0)
        plt_hash = base64.b64encode(plt_IOBytes.read()).decode('utf-8')
    except Exception as e:
        print(f'error: {e}')
    
    anova_lm = anova_lm.to_html().replace('\n', '')

    return json.dumps({
        "data": anova_lm,
        "html": True
    }), json.dumps({
        "label": "Boxplot of Values by Group",
        "data": f"data:image/png;base64,{plt_hash}"
    }), None

def calculate_white_test(data: StatisticsDataType, if_specific: dict):
    _, _, ols = calculate_ols(data, if_specific)
    white_test = sm.stats.diagnostic.het_white(ols.resid, ols.model.exog)

    lm_statistic = white_test[0]
    lm_pvalue = white_test[1]

    # latex to show this in a table
    white_test_summary = f"\\begin{{matrix}} \\ \
        \\text{{LM Statistic}} & \\text{{LM P-Value}} \\newline \\ \
        \\text{lm_statistic} & \\text{lm_pvalue} \\newline \\ \
        \\end{{matrix}}"

    plt.scatter(ols.fittedvalues, ols.resid, s=50, c='blue', alpha=0.5)
    plt.axhline(y=0, color='r', linestyle='-')
    plt.xlabel("Predicted values")
    plt.ylabel("Residuals")
    plt.title("Residuals vs Predicted values")
    plt.grid(True)
    plt_IOBytes = io.BytesIO()
    plt.savefig(plt_IOBytes, format='png')
    plt.clf()
    plt.cla()
    plt_IOBytes.seek(0)
    pic_hash = base64.b64encode(plt_IOBytes.read()).decode('utf-8')

    try:
        return json.dumps({
            "data": white_test_summary,
            "html": False
        }), json.dumps({
            "label": "Graph of residuals vs predicted values",
            "data": f"data:image/png;base64,{pic_hash}"
        }), None
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({}), -1, None

def calculate_durbin_watson(data: StatisticsDataType, if_specific: dict):
    _, _, ols = calculate_ols(data, if_specific)
    dw = sm.stats.stattools.durbin_watson(ols.resid)

    dw_table = f"\\begin{{matrix}} \\ \
        \\text{{Durbin-Watson Statistic}} \\newline \\ \
        \\text{dw} \\newline \\ \
        \\end{{matrix}}"

    plt.figure(figsize=(10, 6))
    plt.scatter(ols.fittedvalues, ols.resid)
    plt.axhline(y=0, color='r', linestyle='--')
    plt.title('Residual Plot')
    plt.xlabel('Predicted Values')
    plt.ylabel('Residuals')
    
    plt_IOBytes = io.BytesIO()
    plt.savefig(plt_IOBytes, format='png')
    plt.clf()  # Clear the figure after saving
    plt_IOBytes.seek(0)
    plot_base64 = base64.b64encode(plt_IOBytes.read()).decode('utf-8')
    
    return json.dumps({
        "data": dw_table,
        "html": False 
    }), json.dumps({
        "label": "Residual Plot",
        "data": f"data:image/png;base64,{plot_base64}"
    }), None

def calculate_jarque_bera(data: StatisticsDataType, if_specific: dict):
    _, _, ols = calculate_ols(data, if_specific)
    jb = sm.stats.jarque_bera(ols.resid)

    jb_stat = jb[0]
    jb_pvalue = jb[1]
    skew = jb[2]
    kurtosis = jb[3]

    jb_table = f"\\begin{{matrix}} \\ \
        \\text{{Jarque-Bera Statistic}} & \\text{{P-Value}} & \\text{{Skewness}} & \\text{{Kurtosis}} \\newline \\ \
        \\text{jb_stat} & \\text{jb_pvalue} & \\text{skew} & \\text{kurtosis} \\newline \\ \
        \\end{{matrix}}"

    try:
        plt.figure(figsize=(10, 6))
        sns.histplot(ols.resid, kde=False, color='blue', stat='density', bins=30)
        
        # Overlay a normal distribution curve
        xmin, xmax = plt.xlim()
        x = np.linspace(xmin, xmax, 100)
        p = norm.pdf(x, np.mean(ols.resid), np.std(ols.resid))
        plt.plot(x, p, 'k', linewidth=2)
        
        title = "Residuals Histogram and Normal Distribution Curve"
        plt.title(title)
        plt.xlabel('Residuals')
        plt.ylabel('Density')
        
        plt_IOBytes = io.BytesIO()
        plt.savefig(plt_IOBytes, format='png')
        plt.clf()  # Clear the figure after saving
        plt_IOBytes.seek(0)
        plot_base64 = base64.b64encode(plt_IOBytes.read()).decode('utf-8')
    except Exception as e:
        print(f'error: {e}')
        plot_base64 = -1
    
    return json.dumps({
        "data": jb_table,
        "html": False
    }), json.dumps({
        "label": title,
        "data": f"data:image/png;base64,{plot_base64}"
    }), None

def calculate_pearson_corr(data: StatisticsDataType, if_specific: dict):
    data_dict = {}
    for item in data:
        data_dict[item.row] = list(item.values)
    new_data = pd.DataFrame.from_dict(data_dict, orient='index').T
    transform_equation(new_data, if_specific)

    try:
        pearson_corr = scipy.pearsonr(new_data.iloc[:, 0], new_data.iloc[:, 1])

        corr_table = f"\\begin{{matrix}} \\ \
            \\text{{Statistic}} & \\text{{P-Value}} \\newline \\ \
            \\text{pearson_corr[0]} & \\text{pearson_corr[1]} \\newline \\ \
            \\end{{matrix}}"
        
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=new_data.iloc[:, 0], y=new_data.iloc[:, 1], data=new_data)
        plt.title(f"Pearson Correlation Plot (for the first two variables: {new_data.columns[0]}, {new_data.columns[1]})")
        plt.xlabel(new_data.columns[0])
        plt.ylabel(new_data.columns[1])
        plt.grid(True)
        plt_IOBytes = io.BytesIO()
        plt.savefig(plt_IOBytes, format='png')
        plt.clf()
        plt_IOBytes.seek(0)
        plot_base64 = base64.b64encode(plt_IOBytes.read()).decode('utf-8')
    except Exception as e:
        print(f'error: {e}')
        plot_base64 = -1

    return json.dumps({
        "data": corr_table,
        "html": False
    }), json.dumps({
        "label": "Scatter Plot",
        "data": f"data:image/png;base64,{plot_base64}"
    }), None

def calculate_spearman_corr(data: StatisticsDataType, if_specific: dict):
    data_dict = {}
    for item in data:
        data_dict[item.row] = list(item.values)
    new_data = pd.DataFrame.from_dict(data_dict, orient='index').T
    transform_equation(new_data, if_specific)

    spearman_corr = scipy.spearmanr(new_data.iloc[:, 0], new_data.iloc[:, 1:])
    
    spearman_table = f"\\begin{{matrix}} \\text{{Statistic}} & \\text{{P-Value}} \\newline "

    if isinstance(spearman_corr[0], np.ndarray):
        # loop through the array and get the values
        for i in range(len(spearman_corr[0])):
            spearman_table += f"\\text{spearman_corr[0][i]} & \\text{spearman_corr[1][i]} \\newline "
    else:
        spearman_table += f"\\text{spearman_corr[0]} & \\text{spearman_corr[1]} \\newline "

    spearman_table += "\\end{matrix}"

    print(spearman_table)

    return json.dumps({
        "data": spearman_table,
        "html": False
    }), json.dumps({}), None

AVAILABLE_METHODS = {
    'anova': calculate_anova,
    'ols': calculate_ols,
    'white_test': calculate_white_test,
    'durbin_watson': calculate_durbin_watson,
    'jarque_bera': calculate_jarque_bera,
    'pearson_corr': calculate_pearson_corr,
    'spearman_corr': calculate_spearman_corr,
}