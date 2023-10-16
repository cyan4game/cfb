//
//  XMediaEngine.h
//  XMedia
//
//  Created by brightzheng on 2017/8/29.
//  Copyright © 2017年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "XMediaResponse.h"
#import "XMediaClassifyResult.h"
#import "XMediaDetectResult.h"
#import "XMediaPredictResult.h"
#import "XMediaOCRResult.h"

extern NSString *const kAPMCameraFrameNotification;
extern NSString *const kAPMCameraFrameSampleBufferKey;

@class XMediaEngine;
/**
 *  delegate回调
 */
@protocol XMediaEngineDelegate <NSObject>
@optional
/**
 *  回调处理结果
 *
 *  @param engine   回调的引擎
 *  @param response 返回对象
 *
 *  @return 是否继续，YES表示继续；NO表示重新处理
 */
- (BOOL)xMediaEngine:(XMediaEngine *)engine callbackWithResponse:(XMediaResponse *)response;
@end

#pragma mark - XMediaEngine

@interface XMediaEngine : NSObject

@property (nonatomic, weak) id<XMediaEngineDelegate> delegate;

/**
 *  初始化引擎
 *
 *  @param biz       业务，找多媒体同学申请分配
 *  @param secretKey 密钥串，找多媒体同学申请分配
 *  @param options   其它参数，包含以下keys：
 *                   kXMediaOptionsModelPathKey
 *
 *  @return 返回引擎对象，如果不支持，将返回nil
 */
- (instancetype)initWithBiz:(NSString *)biz secretKey:(NSString *)secretKey options:(NSDictionary *)options;

#pragma mark - Image

/**
 *  对输入图片中的内容进行分类
 *
 *  @param image   输入图片
 *  @param options 可选参数，支持的key为kXMediaOptionsROIKey
 *
 *  @return 分类的结果
 */
- (XMediaClassifyResult *)classify:(UIImage *)image options:(NSDictionary *)options;

/**
 *  对输入图片中的内容进行检测
 *
 *  @param image   输入图片
 *  @param options 可选参数，支持的key为kXMediaOptionsROIKey
 *
 *  @return 检测的结果
 */
- (XMediaDetectResult *)detect:(UIImage *)image options:(NSDictionary *)options;

/**
 *  通用前向预测
 *
 *  @param vector 输入向量，元素为float型的number
 *
 *  @return 返回结果向量
 */
- (XMediaPredictResult *)predict:(NSArray *)vector;

/**
 *  对输入图片进行OCR处理
 *
 *  @param image   输入图片
 *  @param options 可选参数，支持的key为kXMediaOptionsROIKey
 *
 *  @return 返回结果
 */
- (XMediaOCRResult *)ocr:(UIImage *)image options:(NSDictionary *)options;

#pragma mark - Camera Frame 视频帧传输走通知机制
/**
 *  开始视频帧模式的算法处理
 *
 *  @param mode      算法模式
 *  @param options   可选参数，包含以下keys：
 *                   kXMediaOptionsFilterKey
 *                   kXMediaOptionsROIKey
 */
- (void)startRunningWithMode:(XMediaMode)mode options:(NSDictionary *)options;

/**
 *  结束算法处理
 */
- (void)stopRunning;

@end
