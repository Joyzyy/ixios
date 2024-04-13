generate:
	protoc --proto_path=proto proto/*.proto --go_out=. --go-grpc_out=.

generate_py:
	python3 -m grpc_tools.protoc --proto_path=proto proto/*.proto --python_out=./analysis_server/pb --pyi_out=./analysis_server/pb --grpc_python_out=./analysis_server/pb

