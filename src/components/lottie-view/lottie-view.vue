<template>
	<view class="lottie" id="lottie" ref="lottie" :prop="option" :change:prop="lottie.update" :callMethod="callMethod"
		:change:callMethod="lottie.changeMethod">
	</view>
</template>

<script>
	export default {
		props: {
			option: {
				default: null
			}
		},
		data() {
			return {
				callMethod: {
					name: "play",
					args: []
				}
			}
		},

		methods: {
			stop() {
				this.$set(this.callMethod, 'name', 'stop')
				this.$set(this.callMethod, 'args', [])
			},
			play() {
				this.$set(this.callMethod, 'name', 'play')
				this.$set(this.callMethod, 'args', [])
			},
			pause() {
				this.$set(this.callMethod, 'name', 'pause')
				this.$set(this.callMethod, 'args', [])

			},
			setSpeed(speed) {
				this.$set(this.callMethod, 'name', 'setSpeed')
				this.$set(this.callMethod, 'args', [speed||1])
			},
			
			goToAndStop(value, isFrame){
				this.$set(this.callMethod, 'name', 'goToAndStop')
				this.$set(this.callMethod, 'args', [value,isFrame||false])
			},
			
			goToAndPlay(value, isFrame){
				this.$set(this.callMethod, 'name', 'goToAndPlay')
				this.$set(this.callMethod, 'args', [value,isFrame||false])
			},
			
			/**
			 * @param {Number} direction 1 is forward, -1 is reverse.
			 */
			setDirection(direction){
				this.$set(this.callMethod, 'name', 'setDirection')
				this.$set(this.callMethod, 'args', [direction||1])
				

			},
			
			playSegments(segments, forceFlag){
				this.$set(this.callMethod, 'name', 'setDirection')
				this.$set(this.callMethod, 'args', [segments,forceFlag])
			},
			
			setSubframe(useSubFrames){
				this.$set(this.callMethod, 'name', 'useSubFrames')
				this.$set(this.callMethod, 'args', [useSubFrames])
			},
			 
			destroy(){
				this.$set(this.callMethod, 'name', 'destroy')
				this.$set(this.callMethod, 'args', [])
			},
			 getDuration(isFrame){
				return  isFrame ? this.totalFrames : this.totalFrames / this.frameRate;
			},
			emitMsg(msg) {
				this.$emit(msg.name, msg.params);
			},
			emitData(data) {
				this[data.name]=data.value;
			}
			
			
			}
	}
</script>
<script module="lottie" lang="renderjs">
	import lottie from "./lottie_canvas.min.js"

	export default {
		data() {
			return {
				lottieObj: null,
				events: [
					"complete",
					"loopComplete",
					"enterFrame",
					"segmentStart",
					"config_ready",
					"data_ready",
					"data_failed",
					"loaded_images",
					"DOMLoaded",
					"destroy"
				]
			}
		},
		methods: {

			update(newVal, oldValue, ownerInstance, instance) {

				//this.init(newVal)
			},
			changeMethod(method, oldValue, ownerInstance, instance) {
		
					this.lottieObj[method.name].apply(this.lottieObj, method.args)
				
				
			},
			isHttp(url) {
				return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(url)
			},
			init(option) {
				lottie.destroy();
				if (option.path && typeof option.path === 'object') {
					option.animationData = option.path;
					option.path = undefined;
				}

				this.lottieObj = lottie.loadAnimation({
					container: document.querySelector("#lottie"), // 包含动画的dom元素
					renderer: 'canvas', //渲染出来的是什么格式
					loop: option.loop !== false, //循环播放
					autoplay: option.autoplay !== false, //自动播放
					animationData: option.animationData ? option.animationData : undefined, // 动画json的路径
					path: option.animationData ? undefined : option.path
				});
					
				this.events.forEach((event) => {
					this.lottieObj.removeEventListener(event);
					this.lottieObj.addEventListener(event, () => {
						if(event=='data_ready'){
							let totalFrames = this.lottieObj.getDuration(true);
							
							this.$ownerInstance.callMethod('emitData', {
								name:'frameRate',
								value: this.lottieObj.animationData.fr
							})
							this.$ownerInstance.callMethod('emitData', {
								name:'totalFrames',
								value: totalFrames
							})
							
							
						}
						this.$ownerInstance.callMethod('emitMsg', {
							name: event,
							params: arguments
						})
						this.$ownerInstance.callMethod('emitMsg', {
							name: "onEvent",
							params: {
								name: event,
								args: arguments
							}
						})
					})
				})






			}
		},

		destroyed() {
			this.lottieObj.destroy();
		},
		mounted() {
			this.init(this.option)
		}
	}
</script>

<style scoped>
	.lottie {
		width: 300px;
		height: 300px;
		/* background-color: red; */
	}
</style>
