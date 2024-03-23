class Helper {
  async hashSensitiveFields(fields) {
    const saltRounds = 10;
    for (const field of fields) {
      if (this.changed(field)) {
        this[field] = await bcrypt.hash(this[field], saltRounds);
      }
    }
  }
}

export default Helper;
