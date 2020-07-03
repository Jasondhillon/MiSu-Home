/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSharedAccounts = /* GraphQL */ `
  query GetSharedAccounts($id: ID!) {
    getSharedAccounts(id: $id) {
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
export const listSharedAccountss = /* GraphQL */ `
  query ListSharedAccountss(
    $filter: ModelSharedAccountsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSharedAccountss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
            properties {
              items {
                id
                name
                type
                read_only
              }
            }

          }
        }
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getDevice = /* GraphQL */ `
  query GetDevice($id: ID!) {
    getDevice(id: $id) {
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
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDeviceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getProperty = /* GraphQL */ `
  query GetProperty($id: ID!) {
    getProperty(id: $id) {
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
export const listPropertys = /* GraphQL */ `
  query ListPropertys(
    $filter: ModelPropertyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPropertys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
