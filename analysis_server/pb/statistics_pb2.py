# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: statistics.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x10statistics.proto\x12\nstatistics\"1\n\x12StatisticsDataType\x12\x0b\n\x03row\x18\x01 \x01(\t\x12\x0e\n\x06values\x18\x02 \x03(\x02\"R\n\x11StatisticsRequest\x12,\n\x04\x64\x61ta\x18\x01 \x03(\x0b\x32\x1e.statistics.StatisticsDataType\x12\x0f\n\x07methods\x18\x02 \x03(\t\"3\n\x12StatisticsResponse\x12\r\n\x05steps\x18\x01 \x01(\t\x12\x0e\n\x06result\x18\x02 \x01(\t2\xc9\x01\n\x11StatisticsService\x12X\n\x17\x41nalyzeSimpleStatistics\x12\x1d.statistics.StatisticsRequest\x1a\x1e.statistics.StatisticsResponse\x12Z\n\x19\x41nalyzeAdvancedStatistics\x12\x1d.statistics.StatisticsRequest\x1a\x1e.statistics.StatisticsResponseB\x11Z\x0f./server/proto/b\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'statistics_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  _globals['DESCRIPTOR']._options = None
  _globals['DESCRIPTOR']._serialized_options = b'Z\017./server/proto/'
  _globals['_STATISTICSDATATYPE']._serialized_start=32
  _globals['_STATISTICSDATATYPE']._serialized_end=81
  _globals['_STATISTICSREQUEST']._serialized_start=83
  _globals['_STATISTICSREQUEST']._serialized_end=165
  _globals['_STATISTICSRESPONSE']._serialized_start=167
  _globals['_STATISTICSRESPONSE']._serialized_end=218
  _globals['_STATISTICSSERVICE']._serialized_start=221
  _globals['_STATISTICSSERVICE']._serialized_end=422
# @@protoc_insertion_point(module_scope)
