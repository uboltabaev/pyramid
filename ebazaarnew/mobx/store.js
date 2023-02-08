//import MainStore from './main';
import UserStore from './user';
//import ChatStore from './chat';
//import HomeStore from './home';
import CategoriesStore from './categories';
import RegionsStore from './regions';
import CartStore from './cart';
//import InboxStore from './inbox';

class RootStore {
    constructor() {
        //this.mainStore = new MainStore(this);
        this.userStore = new UserStore(this);
        this.cartStore = new CartStore(this);
        //this.chatStore = new ChatStore(this);
        //this.homeStore = new HomeStore(this);
        this.categoriesStore = new CategoriesStore(this);
        this.regionsStore = new RegionsStore(this);
        //this.inboxStore = new InboxStore(this);
    }
}

export default RootStore;