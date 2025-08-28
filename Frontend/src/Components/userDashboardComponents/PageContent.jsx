import {Posts,Profile,Chat,Notifications,SettingsPage, CreatePost} from './index.js';


// Component to render the correct page content
const PageContent = ({ activePage }) => {
  switch (activePage) {
    case 'posts':
      return <Posts />;
    case 'profile':
      return <Profile />;
    case 'chat':
      return <Chat />; 
    case 'notifications':
      return <Notifications />;
    case 'settings':
      return <SettingsPage />;
    case 'createPost':
      return <CreatePost />;
    default:
      return <Posts />;
  }
};

export default PageContent;