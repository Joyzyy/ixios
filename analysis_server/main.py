import grpc
import pb.statistics_pb2_grpc as ss_grpc
import pb.statistics_pb2 as ss_proto
from concurrent import futures
from stats import descriptive, inferential
from google.protobuf.struct_pb2 import Struct

def process_method(method, data):
    if method in inferential.AVAILABLE_METHODS:
        r, p, _ = inferential.AVAILABLE_METHODS[method](data)
        return method, {'steps': r, 'graphs': p}
    return method, None

class StatisticsServicer(ss_grpc.StatisticsServiceServicer):
    def AnalyzeDescriptiveStatistics(self, request, context):
        data: ss_proto.StatisticsDataType = request.data
        methods: list[str] = request.methods
        result, steps = {}, {}
        for method in methods:
            if method in descriptive.AVAILABLE_METHODS:
                for d in data:
                    try:
                        s, _ = descriptive.AVAILABLE_METHODS[method](list(d.values))
                    except Exception as e:
                        print(f'Error: {e}')
                        s, _ = [f"Error: {e}"], None
                    if d.row not in steps:
                        steps[d.row] = [{method: [s]}]
                    else:
                        steps[d.row].append({method: [s]})
                    result[d.row] = None
        return ss_proto.StatisticsDescriptiveResponse(result=str(steps))
    
    def AnalyzeInferentialStatistics(self, request, context):
        data: ss_proto.StatisticsDataType = request.data
        methods: list[str] = request.methods
        result = Struct()
        for method in methods:
            if method in inferential.AVAILABLE_METHODS:
                r, p, _ = inferential.AVAILABLE_METHODS[method](data)
                result.update({
                    method: {
                        'steps': r,
                        'graphs': p
                    } 
                })
        try:
            return ss_proto.StatisticsInferentialResponse(result=result)
        except Exception as e:
            print(f'Error: {e}')
            return ss_proto.StatisticsInferentialResponse(result=None)

def serve():
    try:
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        ss_grpc.add_StatisticsServiceServicer_to_server(StatisticsServicer(), server)
        server.add_insecure_port('[::]:50051')
        server.start()
        server.wait_for_termination()
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    print("Server started")
    serve()