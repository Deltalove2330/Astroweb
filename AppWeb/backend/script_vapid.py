
from py_vapid import Vapid
import base64
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

v = Vapid()
v.generate_keys()

priv_pem = v.private_pem().decode()
pub_bytes = v.public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
pub_b64 = base64.urlsafe_b64encode(pub_bytes).decode().rstrip('=')

print('VAPID_PUBLIC_KEY  =', repr(pub_b64))
print()
print('VAPID_PRIVATE_KEY:')
print(priv_pem)
