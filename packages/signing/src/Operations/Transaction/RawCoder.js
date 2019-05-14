/**
 * Copyright (c) Benjamin Ansbach - all rights reserved.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Coding = require('@pascalcoin-sbx/common').Coding;
const PublicKey = require('@pascalcoin-sbx/common').Types.Keys.PublicKey;
const CompositeType = Coding.CompositeType;
const Transaction = require('./Operation');

/**
 * The raw coder for a Transaction operation.
 */
class RawCoder extends CompositeType {
  /**
   * Constructor
   */
  constructor() {
    super('data_operation_raw');
    this.description('The coder for the raw representation of a Transaction operation');
    this.addSubType(
      new Coding.Pascal.AccountNumber('sender')
        .description('The sender account.')
    );
    this.addSubType(
      new Coding.Pascal.NOperation('nOperation')
        .description('The next n_operation value of the sender.')
    );
    this.addSubType(
      new Coding.Pascal.AccountNumber('target')
        .description('The receiving account.')
    );
    this.addSubType(
      new Coding.Pascal.Currency('amount')
        .description('The amount that is sent from sender to receiver.')
    );
    this.addSubType(
      new Coding.Pascal.Currency('fee')
        .description('The fee included in the operation.')
    );
    this.addSubType(
      new Coding.Core.BytesWithLength('payload', 2)
        .description('The payload of the operation.')
    );
    this.addSubType(
      new Coding.Pascal.Keys.PublicKey('v2_pubkey')
        .description('Empty pubkey (6 zero bytes) - previously active in <= v2.')
        .withFixedValue(PublicKey.empty())
    );
    this.addSubType(
      new Coding.Core.BytesWithLength('r', 2)
        .description('R value of the signed operation.')
    );
    this.addSubType(
      new Coding.Core.BytesWithLength('s', 2)
        .description('S value of the signed operation.')
    );
  }

  /**
   * @inheritDoc AbstractType#typeInfo
   */
  /* istanbul ignore next */
  get typeInfo() {
    let info = super.typeInfo;

    info.name = 'Transaction Operation (RAW)';
    info.hierarchy.push(info.name);
    return info;
  }

  /**
   * Decodes the encoded Transaction operation.
   *
   * @param {BC|Buffer|Uint8Array|String} bc
   * @param {Boolean} toArray
   * @return {ListOperation}
   */
  decodeFromBytes(bc, toArray = false) {
    const decoded = super.decodeFromBytes(bc, false);
    const op = new Transaction(
      decoded.sender,
      decoded.target,
      decoded.amount
    );

    op.withFee(decoded.fee);
    op.withPayload(decoded.payload);
    op.withNOperation(decoded.nOperation);
    op.withSign(decoded.r, decoded.s);

    return op;
  }
}

module.exports = RawCoder;
