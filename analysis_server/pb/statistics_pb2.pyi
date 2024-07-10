from google.protobuf import struct_pb2 as _struct_pb2
from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class StatisticsDataType(_message.Message):
    __slots__ = ("row", "values")
    ROW_FIELD_NUMBER: _ClassVar[int]
    VALUES_FIELD_NUMBER: _ClassVar[int]
    row: str
    values: _containers.RepeatedScalarFieldContainer[float]
    def __init__(self, row: _Optional[str] = ..., values: _Optional[_Iterable[float]] = ...) -> None: ...

class StatisticsRequest(_message.Message):
    __slots__ = ("data", "methods")
    DATA_FIELD_NUMBER: _ClassVar[int]
    METHODS_FIELD_NUMBER: _ClassVar[int]
    data: _containers.RepeatedCompositeFieldContainer[StatisticsDataType]
    methods: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, data: _Optional[_Iterable[_Union[StatisticsDataType, _Mapping]]] = ..., methods: _Optional[_Iterable[str]] = ...) -> None: ...

class StatisticsDescriptiveResponse(_message.Message):
    __slots__ = ("result",)
    RESULT_FIELD_NUMBER: _ClassVar[int]
    result: str
    def __init__(self, result: _Optional[str] = ...) -> None: ...

class StatisticsInferentialResponse(_message.Message):
    __slots__ = ("result",)
    RESULT_FIELD_NUMBER: _ClassVar[int]
    result: _struct_pb2.Struct
    def __init__(self, result: _Optional[_Union[_struct_pb2.Struct, _Mapping]] = ...) -> None: ...
