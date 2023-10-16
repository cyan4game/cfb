//
//  XMediaCloudConfig.h
//  XMedia
//
//  Created by tao zeng on 2018/7/25.
//  Copyright © 2018年 Alipay. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface XMediaCloudConfig : NSObject

//xNN 云控配置
+ (NSString *)getXNNConfig;

//人体姿态检测功能是否支持
+ (BOOL)getPoseDetectSupport;
//微笑检测功能是否支持
+ (BOOL)getSmileDetectSupport;
//手势检测功能是否支持
+ (BOOL)getGestureDetectSupport;
//手势置信度阈值
+ (NSDictionary *)getGestureThreshold;

//微笑检测实现一次算法，时间最小步长
+ (float)getSmileDetectTime;
//手势检测实现一次算法，时间最小步长
+ (float)getGestureDetectTime;

//人体姿态检测配置
+ (NSDictionary *)getPoseDetectConfig;

//AR平台图像识别开关
+ (BOOL)isFalconAREnable;

//人脸识别兼容性开关
+ (BOOL)isFaceEnable;

//AR平台本地识别兼容性开关
+ (BOOL)isSurfFreakEnableWithSFFlag:(BOOL)isSpringFestival;

//AR平台图像识别模型配置
+(NSDictionary *)getImageRecModelConfigWithSFFlag:(BOOL)isSpringFestival;

//AR平台图像识别最大能力个数
+(NSInteger)getImageRecCount;

//AR平台图像识别引擎列表
//isSpringFestival：是否春节活动
+(NSDictionary *)getImageRecEngineMapWithSFFlag:(BOOL)isSpringFestival;

//AR平台图像识别neon开关
+(BOOL)getImageRecNeonSwitch;

//判断是否需要本地AI识别能力(识花)
+(BOOL)isLocalFlowerRecEnableWithSFFlag:(BOOL)isSpringFestival;

//判断机型是否支持接口
//configDict 机型描述json
+ (BOOL)isDeviceSupportWithConfig:(NSDictionary *)configDict;

//获取AR识别静止上传时识别功能相关配置
+ (NSDictionary *)getARIncidentalRecConfig;

//获取算法自适应相关云控配置
+ (NSDictionary *)getAlgoAdaptiveConfig;

#pragma mark - 春节活动相关
typedef NS_ENUM(NSUInteger,FURecEngineType) {
    FURecEngineType_Server,      //server福字识别
    FURecEngineType_Lbp,        //福字识别Lbp链路
    FURecEngineType_Main       //福字识别主链路
};

//AR平台图像识别春节活动最大能力个数
+(NSInteger)getSpringFestivalImgRecCount;

//获取当前机型应该使用的福字识别引擎类型
+(FURecEngineType)getFuRecEngineType;

//本地AR识别包OK但未识别到AR图片，是否需要服务端补偿识别
+(BOOL)shouldARCompensateRec;

//判断福字确定为福字的识别成功次数
+ (NSInteger)getFuJudgeCount;

//获取AR识别图片压缩配置
+(NSDictionary *)getImageConpressConfig;

//福字是否关闭本地识别，强制走server识别
+(BOOL)isFuForceServerRec;

//获取福字识别，是否降级并返回降级后，最小识别耗时(用于低端机，跳帧跑扫福引擎)
//结果为0表示不降级
+(double)getFuDegradeTime;

//获取福字SSD检测算法出来的roi，进行向外扩充比例，为0表示不扩充
+(double)getFuRoiExpand;

//获取福字在后台是否可以初始化开关
+(BOOL)getFuBackgroundInit;

//获取图像转换识别包最大个数
+(int)getPackageGenMaxCount;
@end
