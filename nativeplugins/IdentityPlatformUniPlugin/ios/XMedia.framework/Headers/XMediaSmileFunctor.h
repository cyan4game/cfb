//
//  XMediaSmileFunctor.h
//  XMedia
//
//  Created by tao zeng on 2019/3/22.
//  Copyright © 2019 Alipay. All rights reserved.
//

#import "XMediaBaseFunctor.h"

@class XMediaClassifyResult;
@interface XMediaSmileFunctor : XMediaBaseFunctor

/**
 *  创建实例之前先调用当前机型是否支持此功能接口，isSupported(继承基类的类方法)
 */

/**
 *  XMediaSmileFunctor初始化
 *
 *  @param bizId 业务标识
 *  @param modelId 模型文件id
 *  @param modelPath 模型路径
 *  @param options 扩展字段，eg.@{kXMediaProcessTimeInterval:@(0.5),kXMediaAlgoConfThreshold:@(0.9),kXMediaRemoteLogSampling:@(0.2)}
 *         微笑阈值：默认0.8
 */
- (instancetype)initWithBizId:(NSString *)bizId
                      modelId:(NSString *)modelId
                    modelPath:(NSString *)modelPath
                      options:(NSDictionary *)options;

/**
 *  微笑检测
 *
 *  @param pixelBuffer 输入视频帧数据
 *  @param frontCamera 输入是否前置相机视频源
 *  @param options 扩展参数
 *
 *  @return 返回微笑检测结果
 */
- (XMediaClassifyResult *)smileDetect:(CVPixelBufferRef)pixelBuffer
      isFrontCamera:(BOOL)frontCamera
            options:(NSDictionary *)options;

/**
 *  微笑打分
 *
 *  @param detectResult 微笑检测结果
 *
 *  @return 返回检测到微笑的置信度,范围，[0~1]，一般置信度>0.8可认为检测到微笑
 */
- (float)smileSocre:(XMediaClassifyResult *)smileResult;

@end
