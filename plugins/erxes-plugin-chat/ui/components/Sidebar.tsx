import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import Avatar from 'erxes-ui/lib/components/nameCard/Avatar';
import Button from 'erxes-ui/lib/components/Button';
import CommonSidebar from 'erxes-ui/lib/layout/components/Sidebar';
import Box from 'erxes-ui/lib/components/Box';
import { ChatListStyle } from '../styles';
import SelectTeamMembers from 'erxes-ui/lib/team/containers/SelectTeamMembers';
import { __, router } from 'erxes-ui/lib/utils';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from 'erxes-ui/lib/types';
import withCurrentUser from 'erxes-ui/lib/auth/containers/withCurrentUser';
import { IUser } from 'erxes-ui/lib/auth/types';
import queryString from 'query-string';

type Props = {
  directChats: any[];
  groupChats: any[];
};

function Sidebar(props: Props & IRouterProps & { currentUser: IUser }) {
  const { directChats, groupChats, history, location, currentUser } = props;
  const queryParams = queryString.parse(location.search);

  const [userIds, setUserIds] = useState(queryParams.userIds || []);

  const renderDirectChats = () => {
    const onAssignedUserSelect = userId => {
      router.setParams(history, { userIds: userId, _id: '' });
    };

    const onChangeUsers = _userIds => {
      setUserIds(_userIds);
    };

    const onStartGroupChat = () => {
      router.setParams(history, { userIds, _id: '' });
    };

    return (
      <>
        <Box title={'Group chats'} isOpen={true} name='showGroupChats'>
          <div style={{ padding: '20px' }}>
            <SelectTeamMembers
              label={__('Choose team member')}
              name='assignedUserIds'
              initialValue={userIds}
              onSelect={onChangeUsers}
            />
            <br />
            <Button style={{ float: 'right' }} onClick={onStartGroupChat}>
              Start group chat
            </Button>
          </div>
          <ChatListStyle>
            {groupChats.map(chat => (
              <li key={chat._id}>
                <Link to={`/erxes-plugin-chat/home?_id=${chat._id}`}>
                  {chat.name}
                </Link>
                <br />
                <br />
                <div style={{ overflow: 'hidden' }}>
                  {chat.participantUsers.map(user => (
                    <div style={{ float: 'left', margin: '0 5px' }}>
                      <Avatar user={user} size={30} />
                    </div>
                  ))}
                </div>
                <br />
                <div>{dayjs(chat.createdAt).format('lll')}</div>
              </li>
            ))}
          </ChatListStyle>
        </Box>
        <br />
        <Box title={'Direct chats'} isOpen={true} name='showDirectChats'>
          <div style={{ padding: '20px' }}>
            <SelectTeamMembers
              label={__('Choose team member')}
              name='assignedUserIds'
              initialValue={''}
              onSelect={onAssignedUserSelect}
              multi={false}
            />
          </div>
          <ChatListStyle>
            {directChats.map(chat => (
              <li key={chat._id}>
                {chat.participantUsers
                  .filter(u => u._id !== currentUser._id)
                  .map(user => (
                    <Link to={`/erxes-plugin-chat/home?_id=${chat._id}`}>
                      {user.details.fullName || user.email}
                    </Link>
                  ))}
                <br />
                <span>{dayjs(chat.createdAt).format('lll')}</span>
              </li>
            ))}
          </ChatListStyle>
        </Box>
      </>
    );
  };

  return (
    <CommonSidebar wide={true} full={true}>
      {renderDirectChats()}
    </CommonSidebar>
  );
}

export default withCurrentUser(withRouter(Sidebar));