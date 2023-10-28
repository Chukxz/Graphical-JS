import struct

def float_to_bin_parts(number,bits=64):
  if bits == 32:            # single precision
    int_pack         = 'I'
    float_pack       = 'f'
    exponent_bits    = 8
    mantissa_bits    = 23
    exponent_bias    = 127
  elif bits == 64:          # double precision. all python floats are this
    int_pack         = 'Q'
    float_pack       = 11
    exponent_bits    = 52
    exponent_bias    = 1023
  else:
    raise ValueError('bits argument must be 32 or 64')
  bin_iter = iter(bin(struct.unpack(int_pack,struct.pack(float_pack,number))[0])[2:].rjust(bits,'0'))
  return [''.join(slice(bin_iter,x)) for x in (1, exponent_bits, mantissa_bits)]

float_to_bin_parts(9.2)