//
//  XMediaPredictFunctor.h
//  XMedia
//
//  Created by tao zeng on 2019/1/23.
//  Copyright © 2019 Alipay. All rights reserved.
//

#import "XMediaBaseFunctor.h"
#import "XMediaPredictResult.h"

@interface XMediaPredictFunctor : XMediaBaseFunctor

/**
 *  创建实例之前先调用当前机型是否支持此功能接口，isSupported(继承基类的类方法)
 */

/**
 *  XMediaPredictFunctor初始化
 *
 *  @param bizId 业务标识
 *  @param modelId 模型文件id
 *  @param modelPath 模型路径
 *  @param options 扩展字段
 */
- (instancetype)initWithBizId:(NSString *)bizId
                      modelId:(NSString *)modelId
                    modelPath:(NSString *)modelPath
                      options:(NSDictionary *)options;

/**
 *  通用前向预测
 *
 *  @param vector 输入向量，元素为float型的number
 *
 *  @return 返回结果向量
 */
- (XMediaPredictResult *)processWithVector:(NSArray *)vector;

@end

