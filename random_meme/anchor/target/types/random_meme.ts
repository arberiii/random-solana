/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/random_meme.json`.
 */
export type RandomMeme = {
  address: '2aqnzzUNCpkdkVeL62rvU4EoDDBg9nRsZaazaWbBdhQX';
  metadata: {
    name: 'randomMeme';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'close';
      discriminator: [98, 165, 201, 177, 108, 65, 206, 96];
      accounts: [
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'randomMeme';
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: 'decrement';
      discriminator: [106, 227, 168, 59, 248, 27, 150, 101];
      accounts: [
        {
          name: 'randomMeme';
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: 'increment';
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33];
      accounts: [
        {
          name: 'randomMeme';
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: 'initialize';
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'randomMeme';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [];
    },
    {
      name: 'set';
      discriminator: [198, 51, 53, 241, 116, 29, 126, 194];
      accounts: [
        {
          name: 'randomMeme';
          writable: true;
        }
      ];
      args: [
        {
          name: 'value';
          type: 'u8';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'randomMeme';
      discriminator: [135, 64, 223, 168, 233, 143, 162, 215];
    }
  ];
  types: [
    {
      name: 'randomMeme';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'count';
            type: 'u8';
          }
        ];
      };
    }
  ];
};