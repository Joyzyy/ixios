from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class DataInputType(_message.Message):
    __slots__ = ("row", "values")
    ROW_FIELD_NUMBER: _ClassVar[int]
    VALUES_FIELD_NUMBER: _ClassVar[int]
    row: str
    values: _containers.RepeatedScalarFieldContainer[int]
    def __init__(self, row: _Optional[str] = ..., values: _Optional[_Iterable[int]] = ...) -> None: ...

class BCRequest(_message.Message):
    __slots__ = ("data",)
    DATA_FIELD_NUMBER: _ClassVar[int]
    data: _containers.RepeatedCompositeFieldContainer[DataInputType]
    def __init__(self, data: _Optional[_Iterable[_Union[DataInputType, _Mapping]]] = ...) -> None: ...

class BCResponse(_message.Message):
    __slots__ = ("result",)
    RESULT_FIELD_NUMBER: _ClassVar[int]
    result: int
    def __init__(self, result: _Optional[int] = ...) -> None: ...
