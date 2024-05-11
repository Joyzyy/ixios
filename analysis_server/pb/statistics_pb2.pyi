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

class StatisticsResponse(_message.Message):
    __slots__ = ("steps", "result")
    STEPS_FIELD_NUMBER: _ClassVar[int]
    RESULT_FIELD_NUMBER: _ClassVar[int]
    steps: str
    result: str
    def __init__(self, steps: _Optional[str] = ..., result: _Optional[str] = ...) -> None: ...
