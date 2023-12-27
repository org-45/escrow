interface EscrowTransaction {
    id: string
    payer: string
    payee: string
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'disputed' | 'cancelled'
    conditions: string
    created_at: string
    updated_at: string
    deposit_received: boolean
    release_conditions_met: boolean
    dispute: {
        is_disputed: boolean
        reason: string | null
        resolution: string | null
    }
    metadata: Record<string, any>
}

class EscrowService {
    private transactions: Record<string, EscrowTransaction> = {
        txn_10001: {
            id: 'txn_10001',
            payer: 'alice@example.com',
            payee: 'bob@example.com',
            amount: 1500.0,
            currency: 'USD',
            status: 'pending',
            conditions: 'Completion of web development project',
            created_at: '2023-12-01T09:00:00Z',
            updated_at: '2023-12-01T09:00:00Z',
            deposit_received: true,
            release_conditions_met: true,
            dispute: {
                is_disputed: false,
                reason: null,
                resolution: null,
            },
            metadata: {
                project_id: 'WD123',
                description: 'Payment for web development services',
            },
        },
        // Add other transactions here...
    }

    deposit(transactionId: string): void {
        const transaction = this.transactions[transactionId]

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        // Logic to process the deposit

        // Update the transaction status
        transaction.status = 'pending'
        transaction.deposit_received = true
        transaction.updated_at = new Date().toISOString() // Updating the timestamp

        // Save the updated transaction
        this.transactions[transactionId] = transaction

        // Notify parties or further actions...
    }

    // Other methods...
    verifyConditions(transactionId: string): boolean {
        const transaction = this.transactions[transactionId]

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        // Example logic to verify conditions
        // This should be replaced with real conditions validation logic
        if (transaction.status === 'pending' && transaction.deposit_received) {
            return transaction.release_conditions_met
        }

        return false
    }

    // Other methods...
    releaseFunds(transactionId: string): void {
        const transaction = this.transactions[transactionId]

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        if (this.verifyConditions(transactionId)) {
            // Logic to release funds to the payee
            // This could involve interfacing with payment gateways, updating ledgers, etc.

            // Update transaction status
            transaction.status = 'completed'
            transaction.updated_at = new Date().toISOString()

            // Save the updated transaction
            this.transactions[transactionId] = transaction

            console.log('FUNDS released: ', transaction.amount)

            // Further actions like notifying parties can be added here
        } else {
            console.log('Conditions not met for releasing funds.')
        }
    }

    disputeTransaction(transactionId: string, reason: string): void {
        const transaction = this.transactions[transactionId]

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        // Mark the transaction as disputed
        transaction.status = 'disputed'
        transaction.dispute.is_disputed = true
        transaction.dispute.reason = reason
        transaction.updated_at = new Date().toISOString()

        // Save the updated transaction
        this.transactions[transactionId] = transaction

        // Notify relevant parties (payer, payee, admin, etc.) about the dispute
        // This could involve sending emails, notifications, or triggering internal workflows
        console.log('there was a dispute for :', transaction.amount)

        // Optionally, trigger a dispute resolution process
    }
    resolveDispute(transactionId: string, resolution: 'payer' | 'payee'): void {
        const transaction = this.transactions[transactionId]

        if (!transaction) {
            throw new Error('Transaction not found')
        }

        if (!transaction.dispute.is_disputed) {
            throw new Error('Transaction is not in dispute')
        }

        // Logic to resolve the dispute
        // This could involve refunding the payer, releasing funds to the payee, etc.

        // Update transaction based on the resolution
        if (resolution === 'payer') {
            // Logic for resolution in favor of the payer
            transaction.status = 'cancelled' // Example status update
            console.log('transaction status', transaction.status)
            // Additional updates as per the resolution logic
        } else if (resolution === 'payee') {
            // Logic for resolution in favor of the payee
            transaction.status = 'completed' // Example status update
            console.log('transaction status', transaction.status)
            // Additional updates as per the resolution logic
        }

        // Clearing the dispute information
        transaction.dispute.is_disputed = false
        transaction.dispute.reason = null
        transaction.dispute.resolution = resolution
        transaction.updated_at = new Date().toISOString()

        // Save the updated transaction
        this.transactions[transactionId] = transaction

        // Notify parties about the resolution
        // This could involve sending notifications, emails, etc.
    }
}

// Example usage
const escrowService = new EscrowService()
const transactionId = 'txn_10001'
escrowService.deposit(transactionId)

// Verifying conditions for the transaction
const conditionsMet = escrowService.verifyConditions(transactionId)
console.log(`Conditions met for transaction ${transactionId}: ${conditionsMet}`)

// Attempt to release funds
escrowService.releaseFunds(transactionId)

const disputeReason = 'Item not received as described'

// Initiating a dispute
escrowService.disputeTransaction(transactionId, disputeReason)

const resolutionOutcome = 'payee' // or 'payer', depending on the situation

// Resolving a dispute
escrowService.resolveDispute(transactionId, resolutionOutcome)
