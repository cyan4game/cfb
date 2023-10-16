//
//  XMediaResult.h
//  XMedia
//
//  Created by Cloud on 2017/9/6.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>

#define     kExtraData          @"extraData"
#define     kProcRstImage       @"resultImage"
#define     kProcRoiImage       @"roiImage"
#define     kProcImage          @"image"

#define     kResultItems        @"resultItems"
#define     kRecLabel           @"label"
#define     kRecBoxCoord        @"bbox"
#define     kRecConf            @"conf"
#define     kRecResult          @"result"

@interface XMediaResult : NSObject

@property (nonatomic, strong) NSError *error;
@property (nonatomic, strong) NSString *jsonResult;

- (instancetype)initWithErrorCode:(NSInteger)errCode errorMessage:(NSString *)errMsg;

/**
 * 用于jsapi反序列化返回dictionary
 */
- (NSObject *)serialize;
@end
