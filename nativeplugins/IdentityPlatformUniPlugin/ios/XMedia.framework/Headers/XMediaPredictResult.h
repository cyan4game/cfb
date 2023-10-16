//
//  XMediaPredictResult.h
//  XMedia
//
//  Created by Cloud on 2017/9/14.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import "XMediaResult.h"

@interface XMediaPredictResult : XMediaResult

@property (nonatomic, copy) NSArray <NSNumber *>*result;

- (instancetype)initWithArray:(NSArray <NSNumber *>*)array;

@end
