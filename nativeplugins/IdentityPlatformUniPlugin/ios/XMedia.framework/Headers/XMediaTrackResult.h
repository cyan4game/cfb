//
//  XMediaTrackResult.h
//  XMedia
//
//  Created by brightzheng on 2017/9/21.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import <XMedia/XMedia.h>

@interface XMediaTrackResultItem : NSObject

@property (nonatomic, copy) NSString *label;
@property (nonatomic, assign) float confidence;
@property (nonatomic, assign) CGRect boundingBox;
@property (nonatomic, assign) BOOL isLost;

@end

@interface XMediaTrackResult : XMediaResult

@property (nonatomic, strong) NSArray <XMediaTrackResultItem *>*items;

- (instancetype)initWithArray:(NSArray <XMediaTrackResultItem *>*)array;

@end
