//
//  XMediaGestureFunctor.h
//  XMedia
//
//  Created by tao zeng on 2019/3/27.
//  Copyright © 2019 Alipay. All rights reserved.
//

#import "XMediaBaseFunctor.h"

@class XMediaDetectResult;
@interface XMediaGestureFunctor : XMediaBaseFunctor

/**
 *  创建实例之前先调用当前机型是否支持此功能接口，isSupported(继承基类的类方法)
 */
/**
*  XMediaPoseDetector初始化
*
*  @param bizId 业务标识
*  @param modelId 模型文件id
*  @param modelPathArray 模型文件路径数组
*  @param options 扩展字段，eg.@{kXMediaProcessTimeInterval:@(0.5),kXMediaAlgoConfThreshold:@(0.9),kXMediaRemoteLogSampling:@(0.2)}
*   手势阈值：默认0.3
*
*/
- (instancetype)initWithBizId:(NSString *)bizId
                      modelId:(NSString *)modelId
               modelPathArray:(NSArray *)modelPathArray
                      options:(NSDictionary *)options;

/**
*  手势检测
*
*  @param pixelBuffer 输入视频帧数据
*  @param frontCamera 输入是否前置相机视频源
*  @param options 扩展参数
*
*  @return 返回手势识别结果
*/
- (XMediaDetectResult *)gestureDetect:(CVPixelBufferRef)pixelBuffer
                        isFrontCamera:(BOOL)frontCamera
                              options:(NSDictionary *)options;

/**
 *  手势打分
 *
 *  @param detectResult 手势检测结果
 *  @param gestureId 所参考手势在id
 *
 *  @return 返回结果匹配分数[0,1]
 */
- (float)gestureScore:(XMediaDetectResult *)detectResult gestureId:(NSString *)gestureId;

@end
