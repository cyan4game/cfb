//
//  NSDictionary+Aliyun.h
//  AliyunIdentityUtils
//
//  Created by nansong.zxc on 2020/7/24.
//  Copyright © 2020 aliyun.com. All rights reserved.
//

#ifndef NSDictionary_Aliyun_h
#define NSDictionary_Aliyun_h

#import <Foundation/Foundation.h>


@interface NSDictionary (Aliyun)
/**
 *  转换成JSON串字符串（没有可读性）
 *
 *  @return JSON字符串
 */
- (NSString *)toJSONString;
 
/**
 *  转换成JSON串字符串（有可读性）
 *
 *  @return JSON字符串
 */
- (NSString *)toStyledJSONString;
@end

#endif
