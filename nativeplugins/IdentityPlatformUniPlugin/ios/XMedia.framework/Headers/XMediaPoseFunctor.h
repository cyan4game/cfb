//
//  XMediaPoseFunctor.h
//  XMedia
//
//  Created by tao zeng on 2019/3/27.
//  Copyright © 2019 Alipay. All rights reserved.
//

#import <XMedia/XMedia.h>
#import <AVFoundation/AVFoundation.h>

@interface XMediaPoseFunctor : XMediaBaseFunctor
/**
 *  创建实例之前先调用当前机型是否支持此功能接口，isSupported(继承基类的类方法)
 */

/**
*  XMediaPoseDetector初始化
*
*  @param bizId 业务标识
*  @param modelId 模型文件id
*  @param modelPathArray 模型文件路径列表，@[算法模型，打分脚本文件]
*  @param options 扩展字段，eg.@{kXMediaProcessTimeInterval:@(0.5),kXMediaRemoteLogSampling:@(0.2)}
*
*/
- (instancetype)initWithBizId:(NSString *)bizId
                      modelId:(NSString *)modelId
               modelPathArray:(NSArray *)modelPathArray
                      options:(NSDictionary *)options;

/**
 *  姿势检测
 *
 *  @param cameraFrame 输入视频帧数据
 *  @param frontCamera 是否前置摄像头
 *
 *  @return 返回结果XMediaDetectResult的数组
 */
- (XMediaDetectResult *)poseDetect:(CVPixelBufferRef)cameraFrame
                 cameraOrientation:(AVCaptureVideoOrientation)cameraOrientation
                     isFrontCamera:(BOOL)frontCamera
                           options:(NSDictionary *)options;

/**
 *  姿势打分
 *
 *  @param detectResult 姿态检测结果
 *  @param poseIndex 所参考姿势在内部姿势结合中的索引值
 *  @param viewWidth view宽
 *  @param viewHeight view高
 *
 *  @return 返回结果匹配分数[0,100]
 */
- (int)poseScore:(XMediaDetectResult *)detectResult
       poseIndex:(int)poseIndex
       viewWidth:(int)viewWidth
      viewHeight:(int)viewHeight;

@end
