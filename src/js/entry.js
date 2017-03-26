import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../less/index.less';
var data = [
    {
        "name" : "法克大人",
        "position": "",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/1.jpg",
        "id" : 1
    },
    {
        "name" : "Pellegrini",
        "position": "文科心, 理科命",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/2.jpg",
        "id" : 2
    },
    {
        "name" : "尼诺",
        "position": "enough talk, let's fuck",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/3.jpg",
        "id" : 3
    },
    {
        "name" : "柒柒",
        "position": "公务员",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/4.jpg",
        "id" : 4
    },
    {
        "name" : "丸子先生",
        "position": '',
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/5.jpg",
        "id" : 5
    },
    {
        "name" : "EMT艾米莉亚",
        "position": '',
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/6.jpg",
        "id" : 6
    },
    {
        "name" : "天南老哥",
        "position": "尚留余威惩不义",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/7.jpg",
        "id" : 7
    },
    {
        "name" : "心脏杰",
        "position": "抑郁症患者。学生。",
        "interest": "可能对CMCC话题下的问题感兴趣",
        "img": "./src/img/8.jpg",
        "id" : 8
    }
]
class SearchBar extends Component{
    changeText(){
        this.props.onFileChange(this.refs.ipt.value);
    }
    render(){
        let {inviteList} = this.props;
        let arr = inviteList.map((ele, index)=>{
            return <strong style={{color:'#262626'}}key = {index}>{ele.name},</strong>
        })
        return (
            <div className="search">
                <span>你已邀请 {arr.slice(0, 3)}邀请 {arr.length} 人</span>
                <input ref='ipt' placeholder="搜索你想邀请的人" onChange={this.changeText.bind(this)}/>
            </div>
        )
    }
}

class InviteItem extends Component{
    onHandleClick(){
        let {ItemMsg, onHandleInvite} = this.props;
        onHandleInvite(ItemMsg['id']);
        
    }
    render(){
        let {ItemMsg} = this.props;
        return (
            <li  className="item">
                <img src={ItemMsg.img}/>
                <div>
                    <h3>{ItemMsg.name}</h3>
                    <p>{ItemMsg.position}</p>
                    <p>{ItemMsg.interest}</p>
                </div>
                <button onClick={this.onHandleClick.bind(this)} style={!ItemMsg.canInvite?{border: '1px solid #ccd8e1',color: '#8590a6'}:{ color: '#11a668',
            border: '1px solid #11a668'}}>{ItemMsg.canInvite?'邀请回答':'收回邀请'}</button>
            </li>
        )
    }
}

class InviteList extends Component{
    componentWillMount(){
        this.onHandleData();
    }
    onHandleData(){
        let {data, fileText, onHandleInvite} = this.props;
        let rows = []
        data.forEach((ele, index)=>{
            if(ele.name.indexOf(fileText) !== -1){
                rows.push(<InviteItem key = {index + 1000}ItemMsg={ele} onHandleInvite={onHandleInvite}/>)
            }
        })
        this.rows = rows;
    }
    componentWillUpdate(nextProps, nextState){
        this.props = nextProps;
        this.onHandleData();
        return true;
    }
    render(){
        return(
            <div>
                <ul>
                    {
                        this.rows
                    }
                </ul>
            </div>
        )
    }
}

class App extends Component{
    constructor(){
        super();
        this.state = {
            fileText: '',
            List: [],
            inviteList: []
        }
    }
    componentWillMount(){
        window.fetch('./data/data.txt').then(function(response){
            return response.json();
        }).then(function(json){
            console.log(json)
        })
        let {data} = this.props;
        data.forEach((ele,index)=>{
            ele.canInvite = true;
        })
        this.state.List = data;
    }
    onFileChange(text){
        this.setState({
            fileText: text
        })
    }
    onHandleInvite(id){
        let {List,inviteList} = this.state;
        let len = List.length;
        let orderList = [...inviteList];
        for(let i = 0; i < len; i++){
            if(List[i]['id'] == id){
                List[i].canInvite = !List[i].canInvite;
                if(!List[i].canInvite){
                    orderList.unshift(List[i])
                }
                break;
            }
        }
        orderList = orderList.filter((ele, index)=>{
            return !ele.canInvite
        })
        this.setState({
            inviteList : orderList,
        })
    }
    render(){
        return(
            <div className="wrapper">
                <SearchBar onFileChange={this.onFileChange.bind(this)} inviteList={this.state.inviteList}/>
                <InviteList data = {this.state.List} fileText={this.state.fileText} onHandleInvite={this.onHandleInvite.bind(this)}/>
            </div>
        )
    }
}

ReactDom.render(
    <App data = {data}/>,
    document.getElementById('root')
)