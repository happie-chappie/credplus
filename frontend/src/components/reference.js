	<div style={{ border: '1px solid black' }}>
      <div className="container p-4">
	<div style={{ border: '1px solid black' }}>
        <div className="row">
          <div className="col-12">
	    {this.state.tokenData && (
	      <div>
		<h1>
		  {this.state.tokenData.name} ({this.state.tokenData.symbol})
		</h1>
		<p>
		  Welcome <b>{this.state.selectedAddress}</b>, you have{" "}
		  <b>
		    {this.state.balance.toString()} {this.state.tokenData.symbol}
		  </b>
		  .
		</p>
	      </div>
	    )}
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
          </div>
        </div>

	{this.state.balance && (
	  <div className="row">
	    <div className="col-12">
	      {/*
		If the user has no tokens, we don't show the Tranfer form
	      */}
	      {this.state.balance.eq(0) && (
		<NoTokensMessage selectedAddress={this.state.selectedAddress} />
	      )}

	      {/*
		This component displays a form that the user can use to send a 
		transaction and transfer some tokens.
		The component doesn't have logic, it just calls the transferTokens
		callback.
	      */}
	      {this.state.balance.gt(0) && (
		<Transfer
		  transferTokens={(to, amount) =>
		    this._transferTokens(to, amount)
		  }
		  tokenSymbol={this.state.tokenData.symbol}
		/>
	      )}
	    </div>
	  </div>
	)}
      </div>
      </div>
      </div>
