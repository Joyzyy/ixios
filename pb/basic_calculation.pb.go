// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.1
// 	protoc        v5.26.1
// source: basic_calculation.proto

package pb

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type DataInputType struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Row    string  `protobuf:"bytes,1,opt,name=row,proto3" json:"row,omitempty"`
	Values []int64 `protobuf:"varint,2,rep,packed,name=values,proto3" json:"values,omitempty"`
}

func (x *DataInputType) Reset() {
	*x = DataInputType{}
	if protoimpl.UnsafeEnabled {
		mi := &file_basic_calculation_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *DataInputType) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*DataInputType) ProtoMessage() {}

func (x *DataInputType) ProtoReflect() protoreflect.Message {
	mi := &file_basic_calculation_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use DataInputType.ProtoReflect.Descriptor instead.
func (*DataInputType) Descriptor() ([]byte, []int) {
	return file_basic_calculation_proto_rawDescGZIP(), []int{0}
}

func (x *DataInputType) GetRow() string {
	if x != nil {
		return x.Row
	}
	return ""
}

func (x *DataInputType) GetValues() []int64 {
	if x != nil {
		return x.Values
	}
	return nil
}

type BCRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Data []*DataInputType `protobuf:"bytes,1,rep,name=data,proto3" json:"data,omitempty"`
}

func (x *BCRequest) Reset() {
	*x = BCRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_basic_calculation_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *BCRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*BCRequest) ProtoMessage() {}

func (x *BCRequest) ProtoReflect() protoreflect.Message {
	mi := &file_basic_calculation_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use BCRequest.ProtoReflect.Descriptor instead.
func (*BCRequest) Descriptor() ([]byte, []int) {
	return file_basic_calculation_proto_rawDescGZIP(), []int{1}
}

func (x *BCRequest) GetData() []*DataInputType {
	if x != nil {
		return x.Data
	}
	return nil
}

type BCResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Result int64 `protobuf:"varint,1,opt,name=result,proto3" json:"result,omitempty"`
}

func (x *BCResponse) Reset() {
	*x = BCResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_basic_calculation_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *BCResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*BCResponse) ProtoMessage() {}

func (x *BCResponse) ProtoReflect() protoreflect.Message {
	mi := &file_basic_calculation_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use BCResponse.ProtoReflect.Descriptor instead.
func (*BCResponse) Descriptor() ([]byte, []int) {
	return file_basic_calculation_proto_rawDescGZIP(), []int{2}
}

func (x *BCResponse) GetResult() int64 {
	if x != nil {
		return x.Result
	}
	return 0
}

var File_basic_calculation_proto protoreflect.FileDescriptor

var file_basic_calculation_proto_rawDesc = []byte{
	0x0a, 0x17, 0x62, 0x61, 0x73, 0x69, 0x63, 0x5f, 0x63, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61, 0x74,
	0x69, 0x6f, 0x6e, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x11, 0x62, 0x61, 0x73, 0x69, 0x63,
	0x5f, 0x63, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x22, 0x39, 0x0a, 0x0d,
	0x44, 0x61, 0x74, 0x61, 0x49, 0x6e, 0x70, 0x75, 0x74, 0x54, 0x79, 0x70, 0x65, 0x12, 0x10, 0x0a,
	0x03, 0x72, 0x6f, 0x77, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x03, 0x72, 0x6f, 0x77, 0x12,
	0x16, 0x0a, 0x06, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x73, 0x18, 0x02, 0x20, 0x03, 0x28, 0x03, 0x52,
	0x06, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x73, 0x22, 0x41, 0x0a, 0x09, 0x42, 0x43, 0x52, 0x65, 0x71,
	0x75, 0x65, 0x73, 0x74, 0x12, 0x34, 0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x01, 0x20, 0x03,
	0x28, 0x0b, 0x32, 0x20, 0x2e, 0x62, 0x61, 0x73, 0x69, 0x63, 0x5f, 0x63, 0x61, 0x6c, 0x63, 0x75,
	0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x44, 0x61, 0x74, 0x61, 0x49, 0x6e, 0x70, 0x75, 0x74,
	0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x64, 0x61, 0x74, 0x61, 0x22, 0x24, 0x0a, 0x0a, 0x42, 0x43,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x72, 0x65, 0x73, 0x75,
	0x6c, 0x74, 0x18, 0x01, 0x20, 0x01, 0x28, 0x03, 0x52, 0x06, 0x72, 0x65, 0x73, 0x75, 0x6c, 0x74,
	0x32, 0x56, 0x0a, 0x10, 0x42, 0x61, 0x73, 0x69, 0x63, 0x43, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61,
	0x74, 0x69, 0x6f, 0x6e, 0x12, 0x42, 0x0a, 0x03, 0x41, 0x64, 0x64, 0x12, 0x1c, 0x2e, 0x62, 0x61,
	0x73, 0x69, 0x63, 0x5f, 0x63, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e,
	0x42, 0x43, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x1d, 0x2e, 0x62, 0x61, 0x73, 0x69,
	0x63, 0x5f, 0x63, 0x61, 0x6c, 0x63, 0x75, 0x6c, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x2e, 0x42, 0x43,
	0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x42, 0x06, 0x5a, 0x04, 0x2e, 0x2f, 0x70, 0x62,
	0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_basic_calculation_proto_rawDescOnce sync.Once
	file_basic_calculation_proto_rawDescData = file_basic_calculation_proto_rawDesc
)

func file_basic_calculation_proto_rawDescGZIP() []byte {
	file_basic_calculation_proto_rawDescOnce.Do(func() {
		file_basic_calculation_proto_rawDescData = protoimpl.X.CompressGZIP(file_basic_calculation_proto_rawDescData)
	})
	return file_basic_calculation_proto_rawDescData
}

var file_basic_calculation_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_basic_calculation_proto_goTypes = []interface{}{
	(*DataInputType)(nil), // 0: basic_calculation.DataInputType
	(*BCRequest)(nil),     // 1: basic_calculation.BCRequest
	(*BCResponse)(nil),    // 2: basic_calculation.BCResponse
}
var file_basic_calculation_proto_depIdxs = []int32{
	0, // 0: basic_calculation.BCRequest.data:type_name -> basic_calculation.DataInputType
	1, // 1: basic_calculation.BasicCalculation.Add:input_type -> basic_calculation.BCRequest
	2, // 2: basic_calculation.BasicCalculation.Add:output_type -> basic_calculation.BCResponse
	2, // [2:3] is the sub-list for method output_type
	1, // [1:2] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_basic_calculation_proto_init() }
func file_basic_calculation_proto_init() {
	if File_basic_calculation_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_basic_calculation_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*DataInputType); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_basic_calculation_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*BCRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_basic_calculation_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*BCResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_basic_calculation_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_basic_calculation_proto_goTypes,
		DependencyIndexes: file_basic_calculation_proto_depIdxs,
		MessageInfos:      file_basic_calculation_proto_msgTypes,
	}.Build()
	File_basic_calculation_proto = out.File
	file_basic_calculation_proto_rawDesc = nil
	file_basic_calculation_proto_goTypes = nil
	file_basic_calculation_proto_depIdxs = nil
}
