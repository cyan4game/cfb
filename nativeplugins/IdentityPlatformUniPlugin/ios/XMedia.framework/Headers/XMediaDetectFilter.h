//
//  XMediaDetectFilter.h
//  XMedia
//
//  Created by Cloud on 2017/9/6.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import "XMediaFilter.h"

@interface XMediaDetectFilterItem : NSObject 
    
@property (nonatomic, assign) float minConfidence;
@property (nonatomic, assign) float maxConfidence;
@property (nonatomic, assign) CGRect boundingBox;

@end

@interface XMediaDetectFilter : XMediaFilter

/**
 * detect结果满足>=改置
 */
@property (nonatomic, assign) int lablesCount;

@property (nonatomic, strong) NSDictionary *filters;

- (instancetype)initWithFilters:(NSDictionary *)filters;


@end
