import numpy as np

def calculate_mean(data: list[float]):
    data_sum = sum(data)
    data_len = len(data)
    mean = data_sum / data_len
    steps = [
        f"\\text{{Sum all the elements in the dataset:}} \\, \\sum{{x}} = {data_sum}"
    ]
    steps.append(
        f"\\text{{Divide the total sum by the number of elements:}} \\, \\text{{\\={{x}}}} = \\frac{{\\sum{{x}}}}{{n}} = \\frac{{{data_sum}}}{{{data_len}}} = \\text{mean}"
    )
    steps.append(f"\\textcolor{{red}}{{\\={{x}}= {mean}}}")
    return steps, mean

def calculate_median(data: list[float]):
    sorted_data = sorted(data)
    n = len(sorted_data)
    steps = ["\\text{{Sort the dataset in ascending order.}}", "\\text{{Identify the middle element(s).}}"]
    if n % 2 == 0:
        median = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
        steps.append(f"\\text{{The length of the data is even, we need to calculate the average of the two middle numbers: Median = }} \\frac{{\\frac{{x}}{{2}}-1+\\frac{{x}}{{2}}}}{{2}} = \\text{median}")
    else:
        median = sorted_data[n // 2]
        steps.append(f"\\text{{The length of the data is odd, the median is the middle number: Median = }} x[\\frac{{n}}{{2}}] = \\text{median}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Median = }} {median}}}")
    return steps, median

def calculate_mode(data: list[float]):
    freq = {}
    for d in data:
        if d in freq:
            freq[d] += 1
        else:
            freq[d] = 1
    mode = max(freq, key=freq.get) if freq else None
    steps = [f"\\text{{Count the frequency of each element.}}", f"\\textcolor{{red}}{{\\text{{Mode = }} {mode}}}"]
    return steps, mode

def calculate_variance(data: list[float]):
    steps = [
        f"\\text{{Calculate the mean of the dataset.}}"
    ]
    steps_mean, mean = calculate_mean(data)
    steps.extend(steps_mean)
    print(f"step: {steps}")
    data_minus_mean = np.array(data) - mean
    steps.append(f"\\text{{Subtract the mean from each element.}} \\, \\text{{x}} - \\={{x}}")
    variance = np.sum(data_minus_mean ** 2) / len(data)
    steps.append(f"\\text{{Calculate the variance.}} \\, \\text{{Variance}} = \\frac{{\\sum{{(x - \\={{x}})^2}}}}{{n}} = \\text{variance}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Variance = }} {variance}}}")
    print(f"step: {steps}")
    return steps, variance

def calculate_std(data: list[float]):
    steps, variance = calculate_variance(data)
    std = variance ** 0.5
    steps.append(f"\\text{{Calculate the square root of the variance to get the standard deviation.}} \\, \\sigma = \\sqrt{{\\text{{Variance}}}}")
    steps.append(f"\\textcolor{{red}}{{\\sigma = {std}}}")
    return steps, std

def calculate_range(data: list[float]):
    steps = [f"\\text{{Sort the data in ascending order.}}"]
    sorted_data = sorted(data)
    range_ = sorted_data[-1] - sorted_data[0]
    steps.append(f"\\text{{Substract the smallest value from the largest value.}} \\, \\text{{Range}} = x_{len(sorted_data)} - x_1 = {sorted_data[-1]} - {sorted_data[0]} = {range_}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Range = }} {range_}}}")
    return steps, range_

def calculate_max(data: list[float]):
    steps = [f"\\text{{Sort the data in ascending order.}}"]
    sorted_data = sorted(data)
    max_val = sorted_data[-1]
    steps.append(f"\\text{{Select the last element.}} \\, \\text{{Max = }} x_{len(sorted_data)} = {max_val}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Max = }} {max_val}}}")
    return steps, max_val

def calculate_min(data: list[float]):
    steps = [f"\\text{{Sort the data in ascending order.}}"]
    sorted_data = sorted(data)
    min_val = sorted_data[0]
    steps.append(f"\\text{{Select the first element.}} \\, \\text{{Min = }} x_1 = {min_val}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Min = }} {min_val}}}")
    return steps, min_val

def calculate_sum(data: list[float]):
    steps = [f"\\text{{Sum all the elements.}} \\, \\sum{{x}} = x_1 + x_2 + ... + x_n = \\text{sum(data)}"]
    total_sum = sum(data)
    steps.append(f"\\textcolor{{red}}{{\\text{{Total sum = }} {total_sum}}}")
    return steps, total_sum

def calculate_count(data: list[float]):
    steps = [f"\\text{{Count the number of elements in the dataset.}}"]
    steps.append(f"\\textcolor{{red}}{{\\text{{Count = }} {len(data)}}}")
    return steps, len(data)

def calculate_kurtosis(data: list[float]):
    steps = []
    std_steps, std = calculate_std(data)
    steps.extend(std_steps)
    data_nomralized = (data - np.mean(data)) / std
    kurtosis = np.sum(data_nomralized ** 4) / len(data) - 3
    steps.append(f"\\text{{Normalize the data.}} \\, \\text{{x}} = \\frac{{\\text{{x -}} \\={{x}}}}{{\\sigma}}")
    steps.append(f"\\text{{Calculate the kurtosis.}} \\, \\text{{Kurtosis}} = \\frac{{\\sum{{(x - \\={{x}})^4}}}}{{n}} - 3 = \\frac{{\\text{np.sum(data_nomralized ** 4)}}}{{\\text{len(data)}}} - 3 = {kurtosis}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Kurtosis = }} {kurtosis}}}")
    return steps, kurtosis

def calculate_skewness(data: list[float]):
    steps = []
    std_steps, std = calculate_std(data)
    steps.extend(std_steps)
    data_normalized = (data - np.mean(data)) / std
    skewness = np.sum(data_normalized ** 3) / len(data)
    steps.append(f"\\text{{Normalize the data.}} \\, \\text{{x}} = \\frac{{\\text{{x -}} \\={{x}}}}{{\\sigma}}")
    steps.append(f"\\text{{Calculate the skewness.}} \\, \\text{{Skewness}} = \\frac{{\\sum{{(x - \\={{x}})^3}}}}{{n}} = \\frac{{\\text{np.sum(data_normalized ** 3)}}}{{\\text{len(data)}}} = {skewness}")
    steps.append(f"\\textcolor{{red}}{{\\text{{Skewness = }} {skewness}}}")
    return steps, skewness

AVAILABLE_METHODS = {
    "mean": calculate_mean,
    "median": calculate_median,
    "std": calculate_std,
    "mode": calculate_mode,
    "variance": calculate_variance,
    "range": calculate_range,
    "max": calculate_max,
    "min": calculate_min,
    "sum": calculate_sum,
    "count": calculate_count,
    "kurtosis": calculate_kurtosis,
    "skewness": calculate_skewness
}
