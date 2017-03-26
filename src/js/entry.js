import React, {Component} from 'react';
import ReactDom from 'react-dom';
import '../less/index.less';
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
        var _self = this;
        window.fetch('./data/data.json').then(function(response){
            return response.json();
        }).then(function(data){
            data.forEach((ele,index)=>{
                ele.canInvite = true;
            })
            _self.setState({
                List: data
            })
        })
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
    <App/>,
    document.getElementById('root')
)