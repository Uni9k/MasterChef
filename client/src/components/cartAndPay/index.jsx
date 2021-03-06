import "./index.less";

import {
  AtBadge,
  AtFloatLayout
} from "taro-ui";

import {
  Image,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Avatar from "../avatar/index";

export default class Ball extends Component {
    constructor(props) {
        super(props)
    }

    toggleModal = () => {
        const { showModal } = this.state;
        this.setState({
            showModal: !showModal
        })
    }

    navigateTo = (url) => {
        const { orderList = [] } = this.props;
        if (!orderList.length) {
            return;
        }
        try {
            Taro.setStorageSync('ORDER_LIST', JSON.stringify(orderList))
            Taro.navigateTo({
                url,
            })
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const { count = 10, orderList = [], onFoodItemMinus = () => { }, onFoodItemAdd = () => { }, onClear = () => { } } = this.props;
        const { showModal = false } = this.state;
        return <View className='bottom_wrapper'>
            <View className='bottom_inner'>
                {
                    count ? <AtBadge value={count} maxValue={99}>
                        <View className='cart' onClick={this.toggleModal}>
                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/rabbit.png' />
                        </View>
                    </AtBadge> : <View className='cart' onClick={this.toggleModal}>
                            <Image src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/rabbit.png' />
                        </View>
                }
                <View className='pay_btn' style={orderList.length ? { background: '#6190E8' } : { background: '#e5e5e5' }} onClick={this.navigateTo.bind(this, '/pages/confirm/index')}>去结算</View>
            </View>
            <AtFloatLayout isOpened={showModal} title="兔兔的点菜单" onClose={this.toggleModal}>
                {
                    orderList.length ? <View>
                        <View className='clear_wrapper'>
                            <Image className='clear_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/clear.png' />
                            <Text onClick={() => {
                                this.toggleModal()
                                onClear()
                            }}>清空点菜单</Text>
                        </View>
                        {
                            orderList.map(item => <View className='food_item' key={item._id}>
                                <View className='food_info'>
                                    <Avatar pic={item.pics.length && item.pics[0].url} text={item.name} />
                                    <View className='food_name'>{item.name}</View>
                                </View>
                                <View className='food_num_icon_wrapper' >
                                    <Image onClick={onFoodItemMinus.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/minus.png' />
                                    <Text>{item.count}</Text>
                                    <Image onClick={onFoodItemAdd.bind(this, item)} className='food_count_icon' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/add.png' />
                                </View>
                            </View>)
                        }
                    </View> : <View className='empty_wrapper'>
                            <Image className='empty_image' src='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/common_icon/empty.png' />
                            <View className='empty_text'>兔兔还没有点菜嗷！</View>
                        </View>
                }
            </AtFloatLayout>
        </View>
    }
}

