# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: basic_calculation.proto
# Protobuf Python Version: 4.25.1
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x17\x62\x61sic_calculation.proto\x12\x11\x62\x61sic_calculation\",\n\rDataInputType\x12\x0b\n\x03row\x18\x01 \x01(\t\x12\x0e\n\x06values\x18\x02 \x03(\x03\";\n\tBCRequest\x12.\n\x04\x64\x61ta\x18\x01 \x03(\x0b\x32 .basic_calculation.DataInputType\"\x1c\n\nBCResponse\x12\x0e\n\x06result\x18\x01 \x01(\x03\x32V\n\x10\x42\x61sicCalculation\x12\x42\n\x03\x41\x64\x64\x12\x1c.basic_calculation.BCRequest\x1a\x1d.basic_calculation.BCResponseB\x06Z\x04./pbb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'basic_calculation_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  _globals['DESCRIPTOR']._options = None
  _globals['DESCRIPTOR']._serialized_options = b'Z\004./pb'
  _globals['_DATAINPUTTYPE']._serialized_start=46
  _globals['_DATAINPUTTYPE']._serialized_end=90
  _globals['_BCREQUEST']._serialized_start=92
  _globals['_BCREQUEST']._serialized_end=151
  _globals['_BCRESPONSE']._serialized_start=153
  _globals['_BCRESPONSE']._serialized_end=181
  _globals['_BASICCALCULATION']._serialized_start=183
  _globals['_BASICCALCULATION']._serialized_end=269
# @@protoc_insertion_point(module_scope)
