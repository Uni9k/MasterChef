import "./index.less";

import {
  AtActivityIndicator,
  AtGrid
} from "taro-ui";

import {
  Button,
  View
} from "@tarojs/components";
import { Component } from "@tarojs/taro";

import Banner from "../../components/banner";
import {
  getGlobalData,
  setGlobalData
} from "../../utils/globalData";

const ADMIN = 1;
const RABBIT = 2;
const OTHERS = 3;

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      hasAuth: false,
      userInfo: {},
      env: getGlobalData('env') || ''
    }
  }

  componentWillMount() { }

  componentDidMount() {
    const _this = this;
    Taro.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          Taro.authorize({
            scope: 'scope.userInfo',
          }).then(res => {
            _this.autoGetUserInfo()
          }).catch(err => {
            _this.setState({
              loading: false
            })
            console.log(err)  // 没有获得授权
            // _this.getUser()
          })
        } else {
          _this.autoGetUserInfo()
        }
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  config = {
    navigationBarTitleText: '首页'
  }

  navigateTo = (url) => {
    Taro.navigateTo({
      url
    })
  }

  buttonGetUserInfo = (ev) => {
    const _this = this;
    const { env } = _this.state;
    const { userInfo = {} } = ev.detail;
    Taro.login({
      success(res) {
        const { code: CODE = '' } = res;
        if (CODE) {
          Taro.cloud.callFunction({
            name: 'users',
            data: {
              action: 'getUser',
              env
            }
          }).then(res => {
            console.log(res)

            // const storageUserId = res && res.result && res.result.data && res.result.data[0] && res.result.data[0]._id || '';
            const userList = res.result && res.result.data || [];
            if (!userList.length) {
              setGlobalData('USER_TYPE', OTHERS)
              Taro.cloud.callFunction({
                name: 'users',
                data: {
                  env,
                  action: 'addUser',
                  userInfo: { ...userInfo, USER_TYPE: OTHERS }
                },
              }).then(res => {
                _this.setState({
                  loading: false,
                  hasAuth: true,
                  userInfo: { ...userInfo, USER_TYPE: OTHERS },
                })
              }).catch(err => { })
            } else {
              setGlobalData('USER_TYPE', userList[0].USER_TYPE)
              _this.setState({
                loading: false,
                hasAuth: true,
                userInfo: userList[0],
              })
            }

            // try {
            //   Taro.setStorageSync('USER_ID', storageUserId)
            // } catch (e) {
            //   console.log(e)
            // }

          }).catch(err => {
            console.log(err)
          })
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  autoGetUserInfo = () => {
    const _this = this;
    Taro.getUserInfo({
      success(res) {
        const { userInfo = {}, } = res;
        _this.setState({
          hasAuth: true,
          userInfo,
        }, _this.updateUser)
      },
      fail(err) {
        console.log(err)
      }
    })
  }

  getUser = () => {
    const _this = this;
    const { env } = _this.state;
    Taro.cloud.callFunction({
      name: 'users',
      data: {
        action: 'getUser',
        env
      }
    }).then(res => {
      const userList = res.result && res.result.data || [];
      if (userList.length) {
        setGlobalData('USER_TYPE', userList[0].USER_TYPE)
        _this.setState({
          loading: false,
          hasAuth: true,
          userInfo: userList[0],
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }

  updateUser = () => {
    const _this = this;
    const { env, userInfo } = _this.state;
    Taro.cloud.callFunction({
      name: 'users',
      data: {
        env,
        action: 'updateUser',
        userInfo
      }
    }).then(res => {
      // const userList = res.result && res.result.data || [];
      // if (userList.length) {
      _this.getUser()
      // _this.setState({
      //   loading: false,
      //   hasAuth: true,
      //   userInfo: { ...userInfo },
      // })
      // }
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    const { userInfo = {}, hasAuth = false, loading = true, } = this.state;
    return (
      <View className='index'>
        <Banner userInfo={userInfo} />
        <View className='loading_wrapper'>
          {
            loading ? <AtActivityIndicator content='加载中...' ></AtActivityIndicator> : null
          }
        </View>
        {
          !loading && !hasAuth ? <Button className='login_btn' open-type="getUserInfo" onGetUserInfo={this.buttonGetUserInfo} >使用微信登录</Button> : null
        }
        {
          userInfo.USER_TYPE ? <View>
            <View className='user_info_container'>
              <View className='user_info_item'>
                {
                  userInfo.nickName ? <Text>你好，{userInfo.nickName}</Text> : null
                }
              </View>
            </View>
            {/* <View className='btn_wrapper'>
              <View className='toMenuWrapper'>
                <Avatar size='small' pic='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E7%B1%B3%E9%A5%AD.png' text='吃' />
                <View className='toMenuBtn'>我要吃饭</View>
              </View>
              <View className='toOrderListWrapper'>
                <Avatar size='small' pic='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E9%A4%90%E5%85%B7.png' text='订' />
                <View className='toOrderListBtn'>我的订单</View>
              </View>
              <View className='toAddSysWrapper'>
                <Avatar size='small' pic='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png' text='类' />
                <View className='toAddSysBtn'>添加类别</View>
              </View>
              <View className='toAddFoodWrapper'>
                <Avatar size='small' pic='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png' text='菜' />
                <View className='toAddFoodBtn'>添加新菜</View>
              </View>
              <View className='toFoodListWrapper'>
                <Avatar size='small' pic='https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png' text='全' />
                <View className='toFoodListBtn'>所有菜品</View>
              </View>
            </View> */}
            <AtGrid onClick={item => {
              this.navigateTo(item.url)
            }} data={
              [
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E7%B1%B3%E9%A5%AD.png',
                  value: '我要吃饭',
                  url: '/pages/menu/index'
                },
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E9%A4%90%E5%85%B7.png',
                  value: '我的订单',
                  url: '/pages/orderList/index'
                },
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%86%B0%E7%AE%B1.png',
                  value: '所有菜品',
                  url: '/pages/foodList/index'
                },
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png',
                  value: '添加新菜',
                  url: '/pages/add/index?type=dish'
                },
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E5%A4%A7%E5%8E%A8%E5%B8%BD.png',
                  value: '添加类别',
                  url: '/pages/add/index?type=sys'
                },
                {
                  image: 'https://wecip.oss-cn-hangzhou.aliyuncs.com/masterChef/index_icon/%E7%88%B1%E5%BF%83.png',
                  value: '我爱兔兔',
                  url: '/pages/love/index'
                },
              ]
            } />
          </View> : null
        }
      </View>
    )
  }
}
