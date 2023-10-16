//
//  XMediaResponse.h
//  XMedia
//
//  Created by Cloud on 2017/9/6.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "XMediaOptions.h"
#import "XMediaResult.h"

extern NSString *const kXMediaResponseModeKey;
extern NSString *const kXMediaResponseResultKey;
extern NSString *const kXMediaResponseErrorKey;
extern NSString *const kXMediaResponseErrorMsgKey;
extern NSString *const kXMediaResponseKeepCallBackKey;
extern NSString *const kXMediaResponseExtraDataKey;

@interface XMediaResponse : NSObject

@property (nonatomic, assign) XMediaMode mode;    /// 该结果由哪个算法返回
@property (nonatomic, strong) XMediaResult *result; /// 算法的结果，如何解析参考下面Image部分接口描述
@property (nonatomic, strong) NSError *error;       /// 错误信息

@end

