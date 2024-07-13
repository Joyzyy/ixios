from pb.statistics_pb2 import StatisticsDataType
from statsmodels.tsa.stattools import acf, pacf, adfuller, kpss
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import json
import base64
import io
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')

def calculate_autocorrelation(data: list[float], ts_specific: dict):
    try:
        _acf = acf(data)
        _pacf = pacf(data)

        min_length = min(len(_acf), len(_pacf))
        result = f"\\begin{{matrix}} \\text{{Index}} & \\text{{Autocorrelation}} & \\text{{Partial Autocorrelation}} \\newline"
        for i in range(min_length):
            result += f"\\text{i} & \\text{_acf[i]} & \\text{_pacf[i]} \\newline "
        result += "\\end{matrix}"

        _, ax = plt.subplots(1, 2, figsize=(10, 5))
        plot_acf(_acf, ax=ax[0])
        plot_pacf(_pacf, ax=ax[1])
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.cla()
        plt.clf()
        buf.seek(0)
        autocorr_img = base64.b64encode(buf.read()).decode('utf-8')
        buf.close()

        return json.dumps({
            "data": result,
            "html": False,
            "method": "Autocorrelation"
        }), json.dumps([{
            "label": "Autocorrelation Plot",
            "data": f"data:image/png;base64,{autocorr_img}"
        }])
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "Autocorrelation"
        }), json.dumps({})

def calculate_adf(data: list[float], ts_specific: dict):
    try:
        adf_test = adfuller(data)
        print(f"adf_test: {adf_test}")
        result = f"\\begin{{matrix}} \\text{{ADF Statistic}} & \\text{{p-value}} & \\text{{Lags Used}} & \\text{{Observations Used}} \\newline "
        result += f"{adf_test[0]} & {adf_test[1]} & {adf_test[2]} & {adf_test[3]} \\newline "
        result += "\\end{matrix} \\newline "
        result += "\\text{Critical values}"
        result += f"\\newline \\begin{{matrix}} \\text{{1\%}} & \\text{{5\%}} & \\text{{10\%}} \\newline "
        for _, value in adf_test[4].items():
            result += f"\\text{value} & "
        result += f" \\end{{matrix}}"

        return json.dumps({
            "data": result,
            "html": False,
            "method": "Augmented Dickey-Fuller Test"
        }), json.dumps({})
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "Augmented Dickey-Fuller Test"
        }), json.dumps({})
    
def calculate_kpss(data: list[float], ts_specific: dict):
    try:
        kpss_test = kpss(data)
        print(f"kpss_test: {kpss_test}")
        result = f"\\begin{{matrix}} \\text{{KPSS Statistic}} & \\text{{p-value}} & \\text{{Lags Used}} \\newline "
        result += f"{kpss_test[0]} & {kpss_test[1]} & {kpss_test[2]} \\newline "
        result += "\\end{matrix} \\newline "
        result += "\\text{Critical values}"
        result += f"\\newline \\begin{{matrix}} \\text{{10\%}} & \\text{{5\%}} & \\text{{2.5\%}} & \\text{{1\%}} \\newline "
        for _, value in kpss_test[3].items():
            result += f"\\text{value} & "
        result += f" \\end{{matrix}}"

        return json.dumps({
            "data": result,
            "html": False,
            "method": "Kwiatkowski-Phillips-Schmidt-Shin Test"
        }), json.dumps({})
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "Kwiatkowski-Phillips-Schmidt-Shin Test"
        }), json.dumps({})

def calculate_rurt(data: list[float], ts_specific: dict):
    try:
        from statsmodels.tsa.stattools import range_unit_root_test
        rurt_test = range_unit_root_test(data)
        result = f"\\begin{{matrix}} \\text{{Test Statistic}} & \\text{{p-value}} \\newline "
        result += f"{rurt_test[0]} & {rurt_test[1]} \\newline "
        result += "\\end{matrix} \\newline "
        result += "\\text{Critical values} "
        result += f"\\newline \\begin{{matrix}} \\text{{10\%}} & \\text{{5\%}} & \\text{{2.5\%}} & \\text{{1\%}} \\newline "
        for _, value in rurt_test[2].items():
            result += f"\\text{value} & "
        result += f" \\end{{matrix}}"

        return json.dumps({
            "data": result,
            "html": False,
            "method": "Range Unit Root Test"
        }), json.dumps({})
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "Range Unit Root Test"
        }), json.dumps({})

def calculate_arima(data: list[float], ts_specific: dict):
    try:
        from statsmodels.tsa.arima.model import ARIMA
        arima_order = ts_specific.get("arima")
        order = (int(arima_order.get("ar")), int(arima_order.get("i")), int(arima_order.get("ma")))
        print(f"order: {order}")
        model = ARIMA(data, order=order)
        model_fit = model.fit()

        try:
            t1 = (model_fit.summary().tables[0])
            t2 = (model_fit.summary().tables[1])
            t3 = (model_fit.summary().tables[2])
        except Exception as e:
            print(f'error: {e}')

        t1, t2, t3 = t1.as_html(), t2.as_html(), t3.as_html()
        t = f'{t1}{t2}{t3}'

        print(model_fit.summary())

        return json.dumps({
            "data": t,
            "html": True,
            "method": "ARIMA"
        }), json.dumps({})
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "ARIMA"
        }), json.dumps({})

def calculate_arma(data: list[float], ts_specific: dict):
    try:
        from statsmodels.tsa.arima.model import ARIMA
        arima_order = ts_specific.get("arima")
        order = (int(arima_order.get("ar")), 0, int(arima_order.get("ma")))
        print(f"order: {order}")
        model = ARIMA(data, order=order)
        model_fit = model.fit()

        try:
            t1 = (model_fit.summary().tables[0])
            t2 = (model_fit.summary().tables[1])
            t3 = (model_fit.summary().tables[2])
        except Exception as e:
            print(f'error: {e}')

        t1, t2, t3 = t1.as_html(), t2.as_html(), t3.as_html()
        t = f'{t1}{t2}{t3}'

        print(model_fit.summary())

        return json.dumps({
            "data": t,
            "html": True,
            "method": "ARIMA"
        }), json.dumps({})
    except Exception as e:
        print(f'error: {e}')
        return json.dumps({
            "data": f"Error: {e}",
            "html": False,
            "method": "ARIMA"
        }), json.dumps({})

AVAILABLE_METHODS = {
    "autocorrelation": calculate_autocorrelation,
    "adf": calculate_adf,
    "kpss": calculate_kpss,
    "range_unit_root_test": calculate_rurt,
    "arima": calculate_arima,
    "arma": calculate_arma,
}