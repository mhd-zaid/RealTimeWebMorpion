import { uuidv7 } from 'uuidv7';
class MorpionService {
  constructor(db) {
    this.DB = db;
  }

  async playMove(partyId, moveUserId, numerousLine, numerousColumn, symbol) {
    const party = await this.DB.Party.findByPk(partyId);
    if (party.status !== 'in progress') {
      throw new Error('La partie n\'est pas en cours.');
    }

    const movesCount = await this.DB.MoovePlay.count({ where: { partyId: partyId } });

    const expectedUserId = movesCount % 2 === 0 ? party.user1Id : party.user2Id;
    if (moveUserId !== expectedUserId) {
      throw new Error('Ce n\'est pas le tour du joueur de jouer.');
    }
 
     const expectedSymbol = moveUserId === party.user1Id ? party.symbolUser1 : party.symbolUser2;
     if (symbol !== expectedSymbol) {
       throw new Error('Le joueur doit jouer le bon symbole.');
     }

    const existingMove = await this.DB.MoovePlay.findOne({
      where: { partyId, numerousLine, numerousColumn },
    });
    if (existingMove) {
      throw new Error('La case est déjà occupée.');
    }
    const id = uuidv7();
    await this.DB.MoovePlay.create({ id, partyId, moveUserId, numerousLine, numerousColumn, symbol });

    const isWinner = await this.checkWinner(partyId, symbol);
    if (isWinner) {
      await this.DB.Party.update({ status: 'finished', winnerId: moveUserId }, { where: { id: partyId } });
      return { status: 'finished', winnerId: moveUserId };
    } else {
      const isDraw = await this.checkDraw(partyId);
      if (isDraw) {
        await this.DB.Party.update({ status: 'finished' }, { where: { id: partyId } });
        return { status: 'draw' };
      } else {
        return { status: 'success' };
      }
    }
  }

  async checkWinner(partyId, symbol){
    const moovePlays = await this.DB.MoovePlay.findAll({ where: { partyId } });
    const board = this.initializeBoard();

    moovePlays.forEach(moove => {
      board[moove.numerousLine][moove.numerousColumn] = moove.symbol;
    });

    console.log(board)

    for (let i = 0; i < 3; i++) {
      if (board[i][0] === symbol && board[i][1] === symbol && board[i][2] === symbol) {
        return true;
      }
    }

    for (let j = 0; j < 3; j++) {
      if (board[0][j] === symbol && board[1][j] === symbol && board[2][j] === symbol) {
        return true;
      }
    }

    if ((board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) ||
      (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol)) {
      return true;
    }

    return false;
  }

    async checkDraw(partyId) {
    const moovePlays = await this.DB.MoovePlay.findAll({ where: { partyId } });
    return moovePlays.length === 9; 
  }

  initializeBoard = () => {
    return [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ];
  }
}

export default MorpionService;