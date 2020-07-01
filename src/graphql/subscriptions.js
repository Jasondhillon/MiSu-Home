/* eslint-disable */
// this is an auto generated file. This will be overwritten
// , $sharee_id: String!
// , sharee_id: $sharee_id
export const onCreateSharedAccounts = /* GraphQL */ `
  subscription OnCreateSharedAccounts($owner: String!, $sharee_id: String!) {
    onCreateSharedAccounts(owner: $owner, sharee_id: $sharee_id) {
      id
      hub_url
      hub_email
      hub_password
      name
      sharer_id
      sharee_id
      sharer_name
      devices {
        items {
          id
          name
          description
          rule_set
          path
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateSharedAccounts1 = /* GraphQL */ `
  subscription OnCreateSharedAccounts1 {
    onCreateSharedAccounts {
      id
      hub_url
      hub_email
      hub_password
      name
      sharer_id
      sharee_id
      sharer_name
      devices {
        items {
          id
          name
          description
          rule_set
          path
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateSharedAccounts = /* GraphQL */ `
  subscription OnUpdateSharedAccounts($owner: String!, $sharee_id: String!) {
    onUpdateSharedAccounts(owner: $owner, sharee_id: $sharee_id) {
      id
      hub_url
      hub_email
      hub_password
      name
      sharer_id
      sharee_id
      sharer_name
      devices {
        items {
          id
          name
          description
          rule_set
          path
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteSharedAccounts = /* GraphQL */ `
  subscription OnDeleteSharedAccounts($owner: String!) {
    onDeleteSharedAccounts(owner: $owner) {
      id
      hub_url
      hub_email
      hub_password
      name
      sharer_id
      sharee_id
      sharer_name
      devices {
        items {
          id
          name
          description
          rule_set
          path
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onCreateDevice = /* GraphQL */ `
  subscription OnCreateDevice {
    onCreateDevice {
      id
      name
      description
      rule_set
      path
      sharedAccountId {
        id
        hub_url
        hub_email
        hub_password
        name
        sharer_id
        sharee_id
        sharer_name
        devices {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      properties {
        items {
          id
          name
          type
          read_only
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDevice = /* GraphQL */ `
  subscription OnUpdateDevice {
    onUpdateDevice {
      id
      name
      description
      rule_set
      path
      sharedAccountId {
        id
        hub_url
        hub_email
        hub_password
        name
        sharer_id
        sharee_id
        sharer_name
        devices {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      properties {
        items {
          id
          name
          type
          read_only
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDevice = /* GraphQL */ `
  subscription OnDeleteDevice {
    onDeleteDevice {
      id
      name
      description
      rule_set
      path
      sharedAccountId {
        id
        hub_url
        hub_email
        hub_password
        name
        sharer_id
        sharee_id
        sharer_name
        devices {
          nextToken
        }
        createdAt
        updatedAt
        owner
      }
      properties {
        items {
          id
          name
          type
          read_only
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProperty = /* GraphQL */ `
  subscription OnCreateProperty {
    onCreateProperty {
      id
      name
      type
      read_only
      device {
        id
        name
        description
        rule_set
        path
        sharedAccountId {
          id
          hub_url
          hub_email
          hub_password
          name
          sharer_id
          sharee_id
          sharer_name
          createdAt
          updatedAt
          owner
        }
        properties {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProperty = /* GraphQL */ `
  subscription OnUpdateProperty {
    onUpdateProperty {
      id
      name
      type
      read_only
      device {
        id
        name
        description
        rule_set
        path
        sharedAccountId {
          id
          hub_url
          hub_email
          hub_password
          name
          sharer_id
          sharee_id
          sharer_name
          createdAt
          updatedAt
          owner
        }
        properties {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProperty = /* GraphQL */ `
  subscription OnDeleteProperty {
    onDeleteProperty {
      id
      name
      type
      read_only
      device {
        id
        name
        description
        rule_set
        path
        sharedAccountId {
          id
          hub_url
          hub_email
          hub_password
          name
          sharer_id
          sharee_id
          sharer_name
          createdAt
          updatedAt
          owner
        }
        properties {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
