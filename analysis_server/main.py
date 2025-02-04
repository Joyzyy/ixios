import grpc
import pb.statistics_pb2_grpc as ss_grpc
import pb.statistics_pb2 as ss_proto
from concurrent import futures
from stats import descriptive, inferential, time_series
from google.protobuf.struct_pb2 import Struct, Value, ListValue
from grpc_reflection.v1alpha import reflection
from google.protobuf.json_format import MessageToDict

class StatisticsServicer(ss_grpc.StatisticsServiceServicer):
    def AnalyzeDescriptiveStatistics(self, request, context):
        print(f"Got request: {request}")
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
        print(f"Got request: {request}")
        data: ss_proto.StatisticsDataType = request.data
        methods: list[str] = request.methods
        if_specific = MessageToDict(request.if_specific)
        result = Struct()
        for method in methods:
            if method in inferential.AVAILABLE_METHODS:
                r, p, _ = inferential.AVAILABLE_METHODS[method](data, if_specific)
                result.update({
                    method: {
                        'steps': r,
                        'graphs': p
                    } 
                })
        try:
            return ss_proto.AnyhowResponse(result=result)
        except Exception as e:
            print(f'Error: {e}')
            return ss_proto.AnyhowResponse(result=None)
        
    def AnalyzeTimeSeriesStatistics(self, request, context):
        print(f"Got request: {request}")
        data: ss_proto.StatisticsDataType = request.data
        methods: list[str] = request.methods
        ts_specific = MessageToDict(request.ts_specific)
        result = Struct()

        for method in methods:
            if method in time_series.AVAILABLE_METHODS:
                for d in data:
                    try:
                        r, p = time_series.AVAILABLE_METHODS[method](list(d.values), ts_specific)
                        if not result.fields.get(d.row):
                            new_list_value = ListValue()
                            new_struct = Struct()
                            new_struct.update({
                                'steps': r,
                                'graphs': p
                            })
                            new_list_value.values.add().struct_value.CopyFrom(new_struct)
                            result.fields[d.row].list_value.CopyFrom(new_list_value)
                        else:
                            new_struct = Struct()
                            new_struct.update({
                                'steps': r,
                                'graphs': p
                            })
                            result.fields[d.row].list_value.values.add().struct_value.CopyFrom(new_struct)
                    except Exception as e:
                        print(f'Error: {e}')
                        r, p = [f"Error: {e}"], None
        try:
            return ss_proto.AnyhowResponse(result=result)
        except Exception as e:
            print(f'Error: {e}')
            return ss_proto.AnyhowResponse(result=None)

def serve():
    try:
        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
        ss_grpc.add_StatisticsServiceServicer_to_server(StatisticsServicer(), server)
        SERVICE_NAMES = (
            ss_proto.DESCRIPTOR.services_by_name['StatisticsService'].full_name,
            reflection.SERVICE_NAME,
        )
        reflection.enable_server_reflection(SERVICE_NAMES, server)
        server.add_insecure_port('[::]:50051')
        server.start()
        server.wait_for_termination()
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    print("Server started")
    serve()