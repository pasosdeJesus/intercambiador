# frozen_string_literal: true

# Funciones traducidas o basadas en https://github.com/toncenter/tonweb
module TonwebHelper

  BOUNCEABLE_TAG=0x11;
  NON_BOUNCEABLE_TAG=0x51;
  TEST_FLAG=0x80;
  # Traducida de
  # https://github.com/toncenter/tonweb/blob/master/src/utils/Utils.js
  # @param data  {ArrayLike<number>}
  # @return [crc_1, crc_2]
  def crc16(data) 
    poly = 0x1021;
    reg = 0;
    message = data.clone
    message << 0
    message << 0
    message.each do |byte|
      mask = 0x80;
      while (mask > 0) 
        reg <<= 1;
        if (byte & mask) != 0
          reg += 1;
        end
        mask >>= 1
        if (reg > 0xffff) 
          reg &= 0xffff;
          reg ^= poly;
        end
      end
    end
    d = reg / 256.0
    return [d.floor, reg % 256]
  end
  module_function :crc16


  # Operador >>> de Javascript
  def der_sinsigno(a, b)
    s = a & 0b10000000000000000000000000000000  # 1 en posición 32
    r = a & 0b01111111111111111111111111111111
    c = r >> b
    if s 
      c |= 0b1000000000000000000000000000000 # 1 en posición 31
    end
    return c
  end


  # Traducida de
  # https://github.com/toncenter/tonweb/blob/master/src/utils/Utils.js
  # @param data  {ArrayLike<number>}
  # @return [crc_1, crc_2]
  def _crc32c(crc, bytes) 
    poly = 0x82f63b78

    crc ^= 0xffffffff
    (0..bytes.length).each do |n|
      crc ^= bytes[n]
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
      dcrc = der_sinsigno(crc)
      crc = crc & 1 ? dcrc  ^ poly : dcrc 
    end
    return crc ^ 0xffffffff
  end

  # Convierte dirección no amigable 
  #   "0:5f34d153e97dfa4193c485926448b920169831c965aafa5615eb36c418eb05a2"
  # en dirección amigable:
  #   "EQBfNNFT6X36QZPEhZJkSLkgFpgxyWWq-lYV6zbEGOsForbv"
  #   Basado en
  # https://github.com/toncenter/tonweb/blob/master/src/utils/Address.js
  def direccion_a_amigable(
    d, menserr, isUrlSafe = true, isBounceable = false, isTestOnly = false)
    if !d 
      menserr << "No hay direccion"
      return ""
    end

    if d.index(":") != 1
      menserr << "Dirección no tiene :"
      return ""
    end
    p = d.split(":")
    if p[0] != "0" && p[0] != "-1"
      menserr << "Comienzo debería ser workchanin 0: o -1:"
      return ""
    end
    workchain = p[0].to_i
    if p[1].length != 64
      menserr << "Después de : deberían ser 64 bytes"
      return ""
    end
    begin
      num = p[1].to_i(16) 
    rescue 
      menserr << "Después de : debería venir número hexadecimal"
      return ""
    end
    ab = [p[1]].pack("H*").unpack("C*")
    if ab.length != 32
      menserr << "Arreglo de bytes debería ser de 32 bytes"
      return ""
    end

    tag = isBounceable ? BOUNCEABLE_TAG : NON_BOUNCEABLE_TAG
    if isTestOnly
      tag |= TEST_FLAG
    end

    dir = ab.clone
    dir.unshift(workchain == -1 ? 0xff : 0)
    dir.unshift(tag)

    dirConCRC = dir.clone
    dosBytes = crc16(dirConCRC)
    dirConCRC << dosBytes[0]
    dirConCRC << dosBytes[1]

    dirBase64 = Base64.encode64(dirConCRC.map{|b| b.chr}.join("")).gsub("\n", "")

   if (isUrlSafe) 
     dirBase64 = dirBase64.gsub(/\+/, '-').gsub(/\//, '_');
   end

   return dirBase64
  end
  module_function :direccion_a_amigable

end

