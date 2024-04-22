import pb.basic_calculation_pb2_grpc as bc
import pb.basic_calculation_pb2 as bc_pb
import grpc
from concurrent import futures

# gRPC server
class BasicCalculationServicer(bc.BasicCalculationServicer):
    def Add(self, request, context):
        data = request.data
        for item in data:
            row = item.row
            values = item.values
            print('row: ', row)
            print('values: ', values)
        return bc_pb.BCResponse(result=-1)
    
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    bc.add_BasicCalculationServicer_to_server(BasicCalculationServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    print("Server started")
    serve()