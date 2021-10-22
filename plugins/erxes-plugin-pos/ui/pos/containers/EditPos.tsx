import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { Alert, withProps, Spinner } from 'erxes-ui';
import React from 'react';
import { graphql } from 'react-apollo';
import { IRouterProps } from 'erxes-ui/lib/types';
import { queries, mutations } from '../graphql';
import {
  EditPosMutationResponse,
  GroupsBulkInsertMutationResponse,
  GroupsQueryResponse,
  IntegrationDetailQueryResponse,
  IntegrationMutationVariables,
  IntegrationsQueryResponse,
  IProductGroup,
  PosDetailQueryResponse
} from '../../types';
import Pos from '../components/Pos';
import { PLUGIN_URL } from '../../constants';

type Props = {
  posId: string;
  queryParams: any;
};

type State = {
  isLoading: boolean;
};

type FinalProps = {
  integrationDetailQuery: IntegrationDetailQueryResponse;
  posDetailQuery: PosDetailQueryResponse;
  groupsQuery: GroupsQueryResponse;
  integrationsQuery: IntegrationsQueryResponse;
} & Props &
  EditPosMutationResponse &
  GroupsBulkInsertMutationResponse &
  IRouterProps;

class EditPosContainer extends React.Component<FinalProps, State> {
  constructor(props: FinalProps) {
    super(props);

    this.state = { isLoading: false };
  }

  render() {
    const {
      groupsQuery,
      posDetailQuery,
      editPosMutation,
      productGroupsBulkInsertMutation,
      history,
      integrationsQuery
    } = this.props;

    const pos = posDetailQuery.posDetail || {};
    const groups = groupsQuery.productGroups || [];
    const integration = pos.integration || {};
    const formIntegrations = integrationsQuery.integrations || [];
    // const categories = productCategoriesQuery.productCategories || [];

    if (posDetailQuery.loading || groupsQuery.loading || integrationsQuery.loading) {
      return <Spinner objective={true} />;
    }

    const save = doc => {
      this.setState({ isLoading: true });

      editPosMutation({
        variables: {
          _id: pos._id,
          ...doc
        }
      })
        .then(() => {
          productGroupsBulkInsertMutation({
            variables: {
              posId: pos._id,
              groups: doc.groups.map(e => ({
                _id: e._id,
                name: e.name,
                description: e.description,
                categoryIds: e.categoryIds || [],
                excludedCategoryIds: e.excludedCategoryIds || [],
                excludedProductIds: e.excludedProductIds || []
              }))
            }
          });
        })
        .then(() => {
          Alert.success('You successfully updated a pos');

          history.push({
            pathname: `${PLUGIN_URL}/pos`,
            search: '?refetchList=true'
          });
        })

        .catch(error => {
          Alert.error(error.message);

          this.setState({ isLoading: false });
        });
    };

    const updatedProps = {
      ...this.props,
      integration,
      groups,
      formIntegrations,
      pos,
      save,
      isActionLoading: this.state.isLoading,
      currentMode: 'update'
    };

    return <Pos {...updatedProps} />;
  }
}

export default withProps<FinalProps>(
  compose(
    graphql<Props, PosDetailQueryResponse, { posId: string }>(
      gql(queries.posDetail),
      {
        name: 'posDetailQuery',
        options: ({ posId }) => ({
          fetchPolicy: 'cache-and-network',
          variables: {
            _id: posId
          }
        })
      }
    ),

    graphql<Props, GroupsQueryResponse, { posId: string }>(
      gql(queries.productGroups),
      {
        name: 'groupsQuery',
        options: ({ posId }) => ({
          fetchPolicy: 'cache-and-network',
          variables: {
            posId
          }
        })
      }
    ),

    graphql<Props, IntegrationsQueryResponse>(gql(queries.integrations), {
      name: 'integrationsQuery',
      options: () => ({
        fetchPolicy: 'cache-and-network',
        variables: {
          kind: 'lead'
        }
      })
    }),

    graphql<
      {},
      EditPosMutationResponse,
      { _id: string } & IntegrationMutationVariables
    >(gql(mutations.posEdit), {
      name: 'editPosMutation'
    }),

    graphql<
      {},
      GroupsBulkInsertMutationResponse,
      { posId: string; groups: IProductGroup[] }
    >(gql(mutations.saveProductGroups), {
      name: 'productGroupsBulkInsertMutation'
    })

    // graphql<Props,EditIntegrationMutationResponse,IntegrationMutationVariables>(
    //   gql(mutations.integrationsEdit),
    //   {
    //     name: 'editIntegrationMutation',
    //     options: {
    //       refetchQueries: [
    //         'leadIntegrations',
    //         'leadIntegrationCounts',
    //         'formDetail'
    //       ]
    //     }
    //   }
    // )
  )(EditPosContainer)
);
