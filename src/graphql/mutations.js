/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSharedAccounts = /* GraphQL */ `
  mutation CreateSharedAccounts(
    $input: CreateSharedAccountsInput!
    $condition: ModelSharedAccountsConditionInput
  ) {
    createSharedAccounts(input: $input, condition: $condition) {
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
export const updateSharedAccounts = /* GraphQL */ `
  mutation UpdateSharedAccounts(
    $input: UpdateSharedAccountsInput!
    $condition: ModelSharedAccountsConditionInput
  ) {
    updateSharedAccounts(input: $input, condition: $condition) {
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
export const deleteSharedAccounts = /* GraphQL */ `
  mutation DeleteSharedAccounts(
    $input: DeleteSharedAccountsInput!
    $condition: ModelSharedAccountsConditionInput
  ) {
    deleteSharedAccounts(input: $input, condition: $condition) {
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
export const createDevice = /* GraphQL */ `
  mutation CreateDevice(
    $input: CreateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    createDevice(input: $input, condition: $condition) {
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
export const updateDevice = /* GraphQL */ `
  mutation UpdateDevice(
    $input: UpdateDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    updateDevice(input: $input, condition: $condition) {
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
export const deleteDevice = /* GraphQL */ `
  mutation DeleteDevice(
    $input: DeleteDeviceInput!
    $condition: ModelDeviceConditionInput
  ) {
    deleteDevice(input: $input, condition: $condition) {
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
export const createProperty = /* GraphQL */ `
  mutation CreateProperty(
    $input: CreatePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    createProperty(input: $input, condition: $condition) {
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
export const updateProperty = /* GraphQL */ `
  mutation UpdateProperty(
    $input: UpdatePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    updateProperty(input: $input, condition: $condition) {
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
export const deleteProperty = /* GraphQL */ `
  mutation DeleteProperty(
    $input: DeletePropertyInput!
    $condition: ModelPropertyConditionInput
  ) {
    deleteProperty(input: $input, condition: $condition) {
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
