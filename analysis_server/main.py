import grpc
from concurrent import futures
import pb.statistics_pb2_grpc as ss_grpc
import pb.statistics_pb2 as ss_proto
import numpy as np

def calculate_mean(data: list[float]):
    steps = [
        "Step 1: Sum all the elements in the dataset.",
        "Step 2: Divide the total sum by the number of elements. Formula: \\text{mean} = \\frac{\\Sigma x}{n}"
    ]
    if data:
        mean = sum(data) / len(data)
        steps.append(f"Calculated mean: {mean}")
    else:
        mean = 0
        steps.append("Dataset is empty. Mean is set to 0.")
    return steps, mean

def calculate_median(data: list[float]):
    steps = ["Step 1: Sort the dataset in ascending order."]
    sorted_data = sorted(data)
    n = len(sorted_data)
    steps.append(f"Step 2: Identify the middle element(s). Sorted data: {sorted_data}")
    if n % 2 == 0:
        median = (sorted_data[n // 2 - 1] + sorted_data[n // 2]) / 2
        steps.append("Step 3: Calculate the average of the two middle numbers. Formula: $\\text{Median} = \frac{x[n/2 - 1] + x[n/2]}{2}$")
    else:
        median = sorted_data[n // 2]
        steps.append("Step 3: Median is the middle number in the sorted list.")
    steps.append(f"Calculated median: {median}")
    return steps, median

def calculate_mode(data: list[float]):
    steps = ["Step 1: Count the frequency of each element."]
    freq = {}
    for d in data:
        if d in freq:
            freq[d] += 1
        else:
            freq[d] = 1
    mode = max(freq, key=freq.get) if freq else None
    steps.append(f"Frequencies: {freq}")
    steps.append(f"Step 2: Determine the element with the highest frequency. Mode: {mode}")
    return steps, mode

def calculate_std(data: list[float]):
    steps, variance = calculate_variance(data)
    std = variance ** 0.5
    steps.append(r"Step 4: Calculate the square root of the variance to get the standard deviation. Formula: $\text{Std Dev} = \sqrt{\text{Variance}}$")
    steps.append(f"Calculated standard deviation: {std}")
    return steps, std

def calculate_variance(data: list[float]):
    steps = [
        "Step 1: Calculate the mean of the dataset.",
        "Step 2: Subtract the mean from each element, square the result, and sum all squared results."
    ]
    mean = sum(data) / len(data) if data else 0
    variance = sum((d - mean) ** 2 for d in data) / len(data) if data else 0
    steps.append(r"Step 3: Divide the total by the number of elements. Formula: $\text{Variance} = \frac{\Sigma(x - \text{mean})^2}{n}$")
    steps.append(f"Calculated variance: {variance}")
    return steps, variance

def calculate_range(data: list[float]):
    steps = ["Step 1: Sort the data.", "Step 2: Subtract the smallest value from the largest value."]
    sorted_data = sorted(data)
    range_ = sorted_data[-1] - sorted_data[0]
    steps.append(f"Calculated range: {range_}")
    return steps, range_

def calculate_max(data: list[float]):
    steps = ["Step 1: Sort the data in ascending order.", "Step 2: Select the last element."]
    sorted_data = sorted(data)
    max_val = sorted_data[-1]
    steps.append(f"Calculated maximum: {max_val}")
    return steps, max_val

def calculate_min(data: list[float]):
    steps = ["Step 1: Sort the data in ascending order.", "Step 2: Select the first element."]
    sorted_data = sorted(data)
    min_val = sorted_data[0]
    steps.append(f"Calculated minimum: {min_val}")
    return steps, min_val

def calculate_sum(data: list[float]):
    steps = ["Step 1: Sum all the elements."]
    total_sum = sum(data)
    steps.append(f"Calculated sum: {total_sum}")
    return steps, total_sum

def calculate_count(data: list[float]):
    steps = ["Step 1: Count the number of elements in the dataset."]
    count = len(data)
    steps.append(f"Calculated count: {count}")
    return steps, count

def calculate_correlation(data: list[float]):
    steps = []
    mean = np.mean(data)
    steps.append(f"Step 1: Calculate the mean of the dataset. Mean: {mean}")
    data_minus_mean = data - mean
    steps.append(f"Step 2: Subtract the mean from each element. Data - Mean: {data_minus_mean}")
    squared_data_minus_mean = data_minus_mean ** 2
    steps.append(f"Step 3: Square the result. (Data - Mean)²: {squared_data_minus_mean}")
    variance = np.sum(squared_data_minus_mean) / len(data)
    std = np.sqrt(variance)
    data_normalized = data_minus_mean / std
    correlation = np.dot(data_normalized, data_normalized) / len(data)
    steps.append("Step 4: Calculate the variance. Formula: \\frac{\Sigma (x - \\text{mean})^2}{n}")
    steps.append("Step 5: Calculate the standard deviation. Formula: \\sqrt{\\text{Variance}}")
    steps.append("Step 6: Divide the result by the standard deviation. Formula: \\frac{x - \\text{mean}}{\\text{Std Dev}}")
    steps.append("Step 7: Calculate the correlation. Formula: \\frac{\\Sigma (x - \\text{mean}) * (y - \\text{mean})}{\\sqrt{\\Sigma (x - \\text{mean})^2 * \\Sigma (y - \\text{mean})^2}}")
    return steps, correlation

SIMPLE_STATISTICS_METHODS = {
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
    "corr": calculate_correlation
}

class StatisticsServicer(ss_grpc.StatisticsServiceServicer):
    def AnalyzeSimpleStatistics(self, request, context):
        data: ss_proto.StatisticsDataType = request.data
        methods: list[str] = request.methods
        result, steps = {}, {}
        print(f'data: {data[0].values}')
        print(f'methods: {methods}')
        for method in methods:
            if method in SIMPLE_STATISTICS_METHODS:
                s, r = SIMPLE_STATISTICS_METHODS[method](list(data[0].values))
                steps[method] = s
                result[method] = r
        return ss_proto.StatisticsResponse(steps=str(steps), result=str(result))
    
    def AnalyzeAdvancedStatistics(self, request, context):
        return super().AnalyzeAdvancedStatistics(request, context)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ss_grpc.add_StatisticsServiceServicer_to_server(StatisticsServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == "__main__":
    print("Server started")
    serve()