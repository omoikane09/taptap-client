import React, { Component } from 'react';
import Search from './Search';
import Info from './Info';
import utils from '../../utils';
import './index.css';

export default class Admin extends Component {
  constructor(props) {
    super(props);
    utils
      .fetchPostData('/stores/rewards/get-required', {
        storeID: JSON.parse(localStorage.getItem('userID'))
      })
      .then(response => {
        this.setState({
          REQUIRED: response.REQUIRED,
          STORE_NAME: response.storeName
        });
      })
      .catch(error => {
        console.log(error);
      });
    this.state = {
      // inital state
      isClickedAddCustomer: false,
      isClickedCustomer: false,
      // 로그인 성공시 받아오는 정보
      STORE_ID: JSON.parse(localStorage.getItem('userID')), // 매장 ID. 적립된 쿠폰 수 조회 및 손님등록시 필요
      // 컴포넌트 띄울때 가져올 정보
      REQUIRED: 0,
      STORE_NAME: '',
      // 손님 클릭시 가져올 정보
      couponsCount: 1, // 적립한 쿠폰 수
      customerID: null,
      phoneNumber: ''
    };
  }

  clickAddCustomer = () => {
    this.setState({
      isClickedAddCustomer: true,
      isClickedCustomer: false
    });
  };

  clickCustomer = (id, phoneNumber) => {
    utils
      .fetchPostData('/stores/coupons/get-coupons-count', {
        customerID: id,
        storeID: this.state.STORE_ID
      })
      .then(response => {
        this.setState({
          isClickedAddCustomer: false,
          isClickedCustomer: true,
          couponsCount: response.count,
          customerID: id,
          phoneNumber
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { clickAddCustomer, clickCustomer } = this;
    const {
      isClickedAddCustomer,
      isClickedCustomer,
      couponsCount,
      REQUIRED,
      STORE_NAME,
      STORE_ID,
      customerID,
      phoneNumber
    } = this.state;
    return (
      <div className="container outerSize admin-background">
        <div className="row outerSize">
          <Search
            clickAddCustomer={clickAddCustomer}
            clickCustomer={clickCustomer}
          />
          <Info
            isClickedAddCustomer={isClickedAddCustomer}
            isClickedCustomer={isClickedCustomer}
            clickCustomer={clickCustomer}
            counts={{ count: couponsCount, REQUIRED }}
            idObject={{
              customerID,
              storeID: STORE_ID,
              storeName: STORE_NAME,
              phoneNumber
            }}
          />
        </div>
      </div>
    );
  }
}
