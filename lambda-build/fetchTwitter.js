!(function (e, t) {
  for (var r in t) e[r] = t[r];
})(
  exports,
  (function (e) {
    var t = {};
    function r(n) {
      if (t[n]) return t[n].exports;
      var i = (t[n] = { i: n, l: !1, exports: {} });
      return e[n].call(i.exports, i, i.exports, r), (i.l = !0), i.exports;
    }
    return (
      (r.m = e),
      (r.c = t),
      (r.d = function (e, t, n) {
        r.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: n });
      }),
      (r.r = function (e) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(e, '__esModule', { value: !0 });
      }),
      (r.t = function (e, t) {
        if ((1 & t && (e = r(e)), 8 & t)) return e;
        if (4 & t && 'object' == typeof e && e && e.__esModule) return e;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, 'default', { enumerable: !0, value: e }),
          2 & t && 'string' != typeof e)
        )
          for (var i in e)
            r.d(
              n,
              i,
              function (t) {
                return e[t];
              }.bind(null, i)
            );
        return n;
      }),
      (r.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return r.d(t, 'a', t), t;
      }),
      (r.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (r.p = ''),
      r((r.s = 605))
    );
  })([
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(212),
        i = r(213),
        o = r(18),
        a = r(108),
        s = r(27),
        u = r(214),
        c = r(4);
      t.OPS = r(61);
      const f = r(215),
        l = t.OPS.OP_RESERVED;
      function d(e) {
        return (
          o.Buffer(e) ||
          (function (e) {
            return (
              o.Number(e) &&
              (e === t.OPS.OP_0 ||
                (e >= t.OPS.OP_1 && e <= t.OPS.OP_16) ||
                e === t.OPS.OP_1NEGATE)
            );
          })(e)
        );
      }
      function h(e) {
        return o.Array(e) && e.every(d);
      }
      function p(e) {
        return 0 === e.length
          ? t.OPS.OP_0
          : 1 === e.length
          ? e[0] >= 1 && e[0] <= 16
            ? l + e[0]
            : 129 === e[0]
            ? t.OPS.OP_1NEGATE
            : void 0
          : void 0;
      }
      function m(e) {
        return Buffer.isBuffer(e);
      }
      function b(e) {
        return Buffer.isBuffer(e);
      }
      function g(e) {
        if (m(e)) return e;
        c(o.Array, e);
        const t = e.reduce(
            (e, t) =>
              b(t)
                ? 1 === t.length && void 0 !== p(t)
                  ? e + 1
                  : e + u.encodingLength(t.length) + t.length
                : e + 1,
            0
          ),
          r = Buffer.allocUnsafe(t);
        let n = 0;
        if (
          (e.forEach((e) => {
            if (b(e)) {
              const t = p(e);
              if (void 0 !== t) return r.writeUInt8(t, n), void (n += 1);
              (n += u.encode(r, e.length, n)), e.copy(r, n), (n += e.length);
            } else r.writeUInt8(e, n), (n += 1);
          }),
          n !== r.length)
        )
          throw new Error('Could not decode chunks');
        return r;
      }
      function v(e) {
        if (((r = e), o.Array(r))) return e;
        var r;
        c(o.Buffer, e);
        const n = [];
        let i = 0;
        for (; i < e.length; ) {
          const r = e[i];
          if (r > t.OPS.OP_0 && r <= t.OPS.OP_PUSHDATA4) {
            const t = u.decode(e, i);
            if (null === t) return null;
            if (((i += t.size), i + t.number > e.length)) return null;
            const r = e.slice(i, i + t.number);
            i += t.number;
            const o = p(r);
            void 0 !== o ? n.push(o) : n.push(r);
          } else n.push(r), (i += 1);
        }
        return n;
      }
      function y(e) {
        const t = -129 & e;
        return t > 0 && t < 4;
      }
      (t.isPushOnly = h),
        (t.compile = g),
        (t.decompile = v),
        (t.toASM = function (e) {
          return (
            m(e) && (e = v(e)),
            e
              .map((e) => {
                if (b(e)) {
                  const t = p(e);
                  if (void 0 === t) return e.toString('hex');
                  e = t;
                }
                return f[e];
              })
              .join(' ')
          );
        }),
        (t.fromASM = function (e) {
          return (
            c(o.String, e),
            g(
              e
                .split(' ')
                .map((e) =>
                  void 0 !== t.OPS[e]
                    ? t.OPS[e]
                    : (c(o.Hex, e), Buffer.from(e, 'hex'))
                )
            )
          );
        }),
        (t.toStack = function (e) {
          return (
            (e = v(e)),
            c(h, e),
            e.map((e) =>
              b(e)
                ? e
                : e === t.OPS.OP_0
                ? Buffer.allocUnsafe(0)
                : n.encode(e - l)
            )
          );
        }),
        (t.isCanonicalPubKey = function (e) {
          return s.isPoint(e);
        }),
        (t.isDefinedHashType = y),
        (t.isCanonicalScriptSignature = function (e) {
          return (
            !!Buffer.isBuffer(e) &&
            !!y(e[e.length - 1]) &&
            a.check(e.slice(0, -1))
          );
        }),
        (t.number = n),
        (t.signature = i);
    },
    function (e, t) {
      e.exports = require('util');
    },
    function (e, t) {
      e.exports = require('crypto');
    },
    ,
    function (e, t, r) {
      var n = r(106),
        i = r(59),
        o = n.tfJSON,
        a = n.TfTypeError,
        s = n.TfPropertyTypeError,
        u = n.tfSubError,
        c = n.getValueTypeName,
        f = {
          arrayOf: function (e, t) {
            function r(r, n) {
              return (
                !!i.Array(r) &&
                !i.Nil(r) &&
                !(void 0 !== t.minLength && r.length < t.minLength) &&
                !(void 0 !== t.maxLength && r.length > t.maxLength) &&
                (void 0 === t.length || r.length === t.length) &&
                r.every(function (t, r) {
                  try {
                    return d(e, t, n);
                  } catch (e) {
                    throw u(e, r);
                  }
                })
              );
            }
            return (
              (e = l(e)),
              (t = t || {}),
              (r.toJSON = function () {
                var r = '[' + o(e) + ']';
                return (
                  void 0 !== t.length
                    ? (r += '{' + t.length + '}')
                    : (void 0 === t.minLength && void 0 === t.maxLength) ||
                      (r +=
                        '{' +
                        (void 0 === t.minLength ? 0 : t.minLength) +
                        ',' +
                        (void 0 === t.maxLength ? 1 / 0 : t.maxLength) +
                        '}'),
                  r
                );
              }),
              r
            );
          },
          maybe: function e(t) {
            function r(r, n) {
              return i.Nil(r) || t(r, n, e);
            }
            return (
              (t = l(t)),
              (r.toJSON = function () {
                return '?' + o(t);
              }),
              r
            );
          },
          map: function (e, t) {
            function r(r, n) {
              if (!i.Object(r)) return !1;
              if (i.Nil(r)) return !1;
              for (var o in r) {
                try {
                  t && d(t, o, n);
                } catch (e) {
                  throw u(e, o, 'key');
                }
                try {
                  var a = r[o];
                  d(e, a, n);
                } catch (e) {
                  throw u(e, o);
                }
              }
              return !0;
            }
            return (
              (e = l(e)),
              t && (t = l(t)),
              (r.toJSON = t
                ? function () {
                    return '{' + o(t) + ': ' + o(e) + '}';
                  }
                : function () {
                    return '{' + o(e) + '}';
                  }),
              r
            );
          },
          object: function (e) {
            var t = {};
            for (var r in e) t[r] = l(e[r]);
            function n(e, r) {
              if (!i.Object(e)) return !1;
              if (i.Nil(e)) return !1;
              var n;
              try {
                for (n in t) {
                  d(t[n], e[n], r);
                }
              } catch (e) {
                throw u(e, n);
              }
              if (r) for (n in e) if (!t[n]) throw new s(void 0, n);
              return !0;
            }
            return (
              (n.toJSON = function () {
                return o(t);
              }),
              n
            );
          },
          anyOf: function () {
            var e = [].slice.call(arguments).map(l);
            function t(t, r) {
              return e.some(function (e) {
                try {
                  return d(e, t, r);
                } catch (e) {
                  return !1;
                }
              });
            }
            return (
              (t.toJSON = function () {
                return e.map(o).join('|');
              }),
              t
            );
          },
          allOf: function () {
            var e = [].slice.call(arguments).map(l);
            function t(t, r) {
              return e.every(function (e) {
                try {
                  return d(e, t, r);
                } catch (e) {
                  return !1;
                }
              });
            }
            return (
              (t.toJSON = function () {
                return e.map(o).join(' & ');
              }),
              t
            );
          },
          quacksLike: function (e) {
            function t(t) {
              return e === c(t);
            }
            return (
              (t.toJSON = function () {
                return e;
              }),
              t
            );
          },
          tuple: function () {
            var e = [].slice.call(arguments).map(l);
            function t(t, r) {
              return (
                !i.Nil(t) &&
                !i.Nil(t.length) &&
                (!r || t.length === e.length) &&
                e.every(function (e, n) {
                  try {
                    return d(e, t[n], r);
                  } catch (e) {
                    throw u(e, n);
                  }
                })
              );
            }
            return (
              (t.toJSON = function () {
                return '(' + e.map(o).join(', ') + ')';
              }),
              t
            );
          },
          value: function (e) {
            function t(t) {
              return t === e;
            }
            return (
              (t.toJSON = function () {
                return e;
              }),
              t
            );
          },
        };
      function l(e) {
        if (i.String(e))
          return '?' === e[0] ? f.maybe(e.slice(1)) : i[e] || f.quacksLike(e);
        if (e && i.Object(e)) {
          if (i.Array(e)) {
            if (1 !== e.length)
              throw new TypeError(
                'Expected compile() parameter of type Array of length 1'
              );
            return f.arrayOf(e[0]);
          }
          return f.object(e);
        }
        return i.Function(e) ? e : f.value(e);
      }
      function d(e, t, r, n) {
        if (i.Function(e)) {
          if (e(t, r)) return !0;
          throw new a(n || e, t);
        }
        return d(l(e), t, r);
      }
      for (var h in ((f.oneOf = f.anyOf), i)) d[h] = i[h];
      for (h in f) d[h] = f[h];
      var p = r(210);
      for (h in p) d[h] = p[h];
      (d.compile = l),
        (d.TfTypeError = a),
        (d.TfPropertyTypeError = s),
        (e.exports = d);
    },
    ,
    function (e, t, r) {
      'use strict';
      var n = r(93),
        i = Object.prototype.toString;
      function o(e) {
        return '[object Array]' === i.call(e);
      }
      function a(e) {
        return void 0 === e;
      }
      function s(e) {
        return null !== e && 'object' == typeof e;
      }
      function u(e) {
        return '[object Function]' === i.call(e);
      }
      function c(e, t) {
        if (null != e)
          if (('object' != typeof e && (e = [e]), o(e)))
            for (var r = 0, n = e.length; r < n; r++) t.call(null, e[r], r, e);
          else
            for (var i in e)
              Object.prototype.hasOwnProperty.call(e, i) &&
                t.call(null, e[i], i, e);
      }
      e.exports = {
        isArray: o,
        isArrayBuffer: function (e) {
          return '[object ArrayBuffer]' === i.call(e);
        },
        isBuffer: function (e) {
          return (
            null !== e &&
            !a(e) &&
            null !== e.constructor &&
            !a(e.constructor) &&
            'function' == typeof e.constructor.isBuffer &&
            e.constructor.isBuffer(e)
          );
        },
        isFormData: function (e) {
          return 'undefined' != typeof FormData && e instanceof FormData;
        },
        isArrayBufferView: function (e) {
          return 'undefined' != typeof ArrayBuffer && ArrayBuffer.isView
            ? ArrayBuffer.isView(e)
            : e && e.buffer && e.buffer instanceof ArrayBuffer;
        },
        isString: function (e) {
          return 'string' == typeof e;
        },
        isNumber: function (e) {
          return 'number' == typeof e;
        },
        isObject: s,
        isUndefined: a,
        isDate: function (e) {
          return '[object Date]' === i.call(e);
        },
        isFile: function (e) {
          return '[object File]' === i.call(e);
        },
        isBlob: function (e) {
          return '[object Blob]' === i.call(e);
        },
        isFunction: u,
        isStream: function (e) {
          return s(e) && u(e.pipe);
        },
        isURLSearchParams: function (e) {
          return (
            'undefined' != typeof URLSearchParams &&
            e instanceof URLSearchParams
          );
        },
        isStandardBrowserEnv: function () {
          return (
            ('undefined' == typeof navigator ||
              ('ReactNative' !== navigator.product &&
                'NativeScript' !== navigator.product &&
                'NS' !== navigator.product)) &&
            'undefined' != typeof window &&
            'undefined' != typeof document
          );
        },
        forEach: c,
        merge: function e() {
          var t = {};
          function r(r, n) {
            'object' == typeof t[n] && 'object' == typeof r
              ? (t[n] = e(t[n], r))
              : (t[n] = r);
          }
          for (var n = 0, i = arguments.length; n < i; n++) c(arguments[n], r);
          return t;
        },
        deepMerge: function e() {
          var t = {};
          function r(r, n) {
            'object' == typeof t[n] && 'object' == typeof r
              ? (t[n] = e(t[n], r))
              : (t[n] = 'object' == typeof r ? e({}, r) : r);
          }
          for (var n = 0, i = arguments.length; n < i; n++) c(arguments[n], r);
          return t;
        },
        extend: function (e, t, r) {
          return (
            c(t, function (t, i) {
              e[i] = r && 'function' == typeof t ? n(t, r) : t;
            }),
            e
          );
        },
        trim: function (e) {
          return e.replace(/^\s*/, '').replace(/\s*$/, '');
        },
      };
    },
    function (e, t, r) {
      'use strict';
      var n = t,
        i = r(14),
        o = r(24),
        a = r(86);
      (n.assert = o),
        (n.toArray = a.toArray),
        (n.zero2 = a.zero2),
        (n.toHex = a.toHex),
        (n.encode = a.encode),
        (n.getNAF = function (e, t, r) {
          var n = new Array(Math.max(e.bitLength(), r) + 1);
          n.fill(0);
          for (var i = 1 << (t + 1), o = e.clone(), a = 0; a < n.length; a++) {
            var s,
              u = o.andln(i - 1);
            o.isOdd()
              ? ((s = u > (i >> 1) - 1 ? (i >> 1) - u : u), o.isubn(s))
              : (s = 0),
              (n[a] = s),
              o.iushrn(1);
          }
          return n;
        }),
        (n.getJSF = function (e, t) {
          var r = [[], []];
          (e = e.clone()), (t = t.clone());
          for (var n = 0, i = 0; e.cmpn(-n) > 0 || t.cmpn(-i) > 0; ) {
            var o,
              a,
              s,
              u = (e.andln(3) + n) & 3,
              c = (t.andln(3) + i) & 3;
            if ((3 === u && (u = -1), 3 === c && (c = -1), 0 == (1 & u))) o = 0;
            else
              o =
                (3 !== (s = (e.andln(7) + n) & 7) && 5 !== s) || 2 !== c
                  ? u
                  : -u;
            if ((r[0].push(o), 0 == (1 & c))) a = 0;
            else
              a =
                (3 !== (s = (t.andln(7) + i) & 7) && 5 !== s) || 2 !== u
                  ? c
                  : -c;
            r[1].push(a),
              2 * n === o + 1 && (n = 1 - n),
              2 * i === a + 1 && (i = 1 - i),
              e.iushrn(1),
              t.iushrn(1);
          }
          return r;
        }),
        (n.cachedProperty = function (e, t, r) {
          var n = '_' + t;
          e.prototype[t] = function () {
            return void 0 !== this[n] ? this[n] : (this[n] = r.call(this));
          };
        }),
        (n.parseBytes = function (e) {
          return 'string' == typeof e ? n.toArray(e, 'hex') : e;
        }),
        (n.intFromLE = function (e) {
          return new i(e, 'hex', 'le');
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.bitcoin = {
          messagePrefix: 'Bitcoin Signed Message:\n',
          bech32: 'bc',
          bip32: { public: 76067358, private: 76066276 },
          pubKeyHash: 0,
          scriptHash: 5,
          wif: 128,
        }),
        (t.regtest = {
          messagePrefix: 'Bitcoin Signed Message:\n',
          bech32: 'bcrt',
          bip32: { public: 70617039, private: 70615956 },
          pubKeyHash: 111,
          scriptHash: 196,
          wif: 239,
        }),
        (t.testnet = {
          messagePrefix: 'Bitcoin Signed Message:\n',
          bech32: 'tb',
          bip32: { public: 70617039, private: 70615956 },
          pubKeyHash: 111,
          scriptHash: 196,
          wif: 239,
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (function (e) {
          (e[(e.UNSIGNED_TX = 0)] = 'UNSIGNED_TX'),
            (e[(e.GLOBAL_XPUB = 1)] = 'GLOBAL_XPUB');
        })(t.GlobalTypes || (t.GlobalTypes = {})),
        (t.GLOBAL_TYPE_NAMES = ['unsignedTx', 'globalXpub']),
        (function (e) {
          (e[(e.NON_WITNESS_UTXO = 0)] = 'NON_WITNESS_UTXO'),
            (e[(e.WITNESS_UTXO = 1)] = 'WITNESS_UTXO'),
            (e[(e.PARTIAL_SIG = 2)] = 'PARTIAL_SIG'),
            (e[(e.SIGHASH_TYPE = 3)] = 'SIGHASH_TYPE'),
            (e[(e.REDEEM_SCRIPT = 4)] = 'REDEEM_SCRIPT'),
            (e[(e.WITNESS_SCRIPT = 5)] = 'WITNESS_SCRIPT'),
            (e[(e.BIP32_DERIVATION = 6)] = 'BIP32_DERIVATION'),
            (e[(e.FINAL_SCRIPTSIG = 7)] = 'FINAL_SCRIPTSIG'),
            (e[(e.FINAL_SCRIPTWITNESS = 8)] = 'FINAL_SCRIPTWITNESS'),
            (e[(e.POR_COMMITMENT = 9)] = 'POR_COMMITMENT');
        })(t.InputTypes || (t.InputTypes = {})),
        (t.INPUT_TYPE_NAMES = [
          'nonWitnessUtxo',
          'witnessUtxo',
          'partialSig',
          'sighashType',
          'redeemScript',
          'witnessScript',
          'bip32Derivation',
          'finalScriptSig',
          'finalScriptWitness',
          'porCommitment',
        ]),
        (function (e) {
          (e[(e.REDEEM_SCRIPT = 0)] = 'REDEEM_SCRIPT'),
            (e[(e.WITNESS_SCRIPT = 1)] = 'WITNESS_SCRIPT'),
            (e[(e.BIP32_DERIVATION = 2)] = 'BIP32_DERIVATION');
        })(t.OutputTypes || (t.OutputTypes = {})),
        (t.OUTPUT_TYPE_NAMES = [
          'redeemScript',
          'witnessScript',
          'bip32Derivation',
        ]);
    },
    ,
    ,
    ,
    ,
    function (e, t, r) {
      (function (e) {
        !(function (e, t) {
          'use strict';
          function n(e, t) {
            if (!e) throw new Error(t || 'Assertion failed');
          }
          function i(e, t) {
            e.super_ = t;
            var r = function () {};
            (r.prototype = t.prototype),
              (e.prototype = new r()),
              (e.prototype.constructor = e);
          }
          function o(e, t, r) {
            if (o.isBN(e)) return e;
            (this.negative = 0),
              (this.words = null),
              (this.length = 0),
              (this.red = null),
              null !== e &&
                (('le' !== t && 'be' !== t) || ((r = t), (t = 10)),
                this._init(e || 0, t || 10, r || 'be'));
          }
          var a;
          'object' == typeof e ? (e.exports = o) : (t.BN = o),
            (o.BN = o),
            (o.wordSize = 26);
          try {
            a = r(32).Buffer;
          } catch (e) {}
          function s(e, t, r) {
            for (var n = 0, i = Math.min(e.length, r), o = t; o < i; o++) {
              var a = e.charCodeAt(o) - 48;
              (n <<= 4),
                (n |=
                  a >= 49 && a <= 54
                    ? a - 49 + 10
                    : a >= 17 && a <= 22
                    ? a - 17 + 10
                    : 15 & a);
            }
            return n;
          }
          function u(e, t, r, n) {
            for (var i = 0, o = Math.min(e.length, r), a = t; a < o; a++) {
              var s = e.charCodeAt(a) - 48;
              (i *= n),
                (i += s >= 49 ? s - 49 + 10 : s >= 17 ? s - 17 + 10 : s);
            }
            return i;
          }
          (o.isBN = function (e) {
            return (
              e instanceof o ||
              (null !== e &&
                'object' == typeof e &&
                e.constructor.wordSize === o.wordSize &&
                Array.isArray(e.words))
            );
          }),
            (o.max = function (e, t) {
              return e.cmp(t) > 0 ? e : t;
            }),
            (o.min = function (e, t) {
              return e.cmp(t) < 0 ? e : t;
            }),
            (o.prototype._init = function (e, t, r) {
              if ('number' == typeof e) return this._initNumber(e, t, r);
              if ('object' == typeof e) return this._initArray(e, t, r);
              'hex' === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36);
              var i = 0;
              '-' === (e = e.toString().replace(/\s+/g, ''))[0] && i++,
                16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i),
                '-' === e[0] && (this.negative = 1),
                this.strip(),
                'le' === r && this._initArray(this.toArray(), t, r);
            }),
            (o.prototype._initNumber = function (e, t, r) {
              e < 0 && ((this.negative = 1), (e = -e)),
                e < 67108864
                  ? ((this.words = [67108863 & e]), (this.length = 1))
                  : e < 4503599627370496
                  ? ((this.words = [67108863 & e, (e / 67108864) & 67108863]),
                    (this.length = 2))
                  : (n(e < 9007199254740992),
                    (this.words = [67108863 & e, (e / 67108864) & 67108863, 1]),
                    (this.length = 3)),
                'le' === r && this._initArray(this.toArray(), t, r);
            }),
            (o.prototype._initArray = function (e, t, r) {
              if ((n('number' == typeof e.length), e.length <= 0))
                return (this.words = [0]), (this.length = 1), this;
              (this.length = Math.ceil(e.length / 3)),
                (this.words = new Array(this.length));
              for (var i = 0; i < this.length; i++) this.words[i] = 0;
              var o,
                a,
                s = 0;
              if ('be' === r)
                for (i = e.length - 1, o = 0; i >= 0; i -= 3)
                  (a = e[i] | (e[i - 1] << 8) | (e[i - 2] << 16)),
                    (this.words[o] |= (a << s) & 67108863),
                    (this.words[o + 1] = (a >>> (26 - s)) & 67108863),
                    (s += 24) >= 26 && ((s -= 26), o++);
              else if ('le' === r)
                for (i = 0, o = 0; i < e.length; i += 3)
                  (a = e[i] | (e[i + 1] << 8) | (e[i + 2] << 16)),
                    (this.words[o] |= (a << s) & 67108863),
                    (this.words[o + 1] = (a >>> (26 - s)) & 67108863),
                    (s += 24) >= 26 && ((s -= 26), o++);
              return this.strip();
            }),
            (o.prototype._parseHex = function (e, t) {
              (this.length = Math.ceil((e.length - t) / 6)),
                (this.words = new Array(this.length));
              for (var r = 0; r < this.length; r++) this.words[r] = 0;
              var n,
                i,
                o = 0;
              for (r = e.length - 6, n = 0; r >= t; r -= 6)
                (i = s(e, r, r + 6)),
                  (this.words[n] |= (i << o) & 67108863),
                  (this.words[n + 1] |= (i >>> (26 - o)) & 4194303),
                  (o += 24) >= 26 && ((o -= 26), n++);
              r + 6 !== t &&
                ((i = s(e, t, r + 6)),
                (this.words[n] |= (i << o) & 67108863),
                (this.words[n + 1] |= (i >>> (26 - o)) & 4194303)),
                this.strip();
            }),
            (o.prototype._parseBase = function (e, t, r) {
              (this.words = [0]), (this.length = 1);
              for (var n = 0, i = 1; i <= 67108863; i *= t) n++;
              n--, (i = (i / t) | 0);
              for (
                var o = e.length - r,
                  a = o % n,
                  s = Math.min(o, o - a) + r,
                  c = 0,
                  f = r;
                f < s;
                f += n
              )
                (c = u(e, f, f + n, t)),
                  this.imuln(i),
                  this.words[0] + c < 67108864
                    ? (this.words[0] += c)
                    : this._iaddn(c);
              if (0 !== a) {
                var l = 1;
                for (c = u(e, f, e.length, t), f = 0; f < a; f++) l *= t;
                this.imuln(l),
                  this.words[0] + c < 67108864
                    ? (this.words[0] += c)
                    : this._iaddn(c);
              }
            }),
            (o.prototype.copy = function (e) {
              e.words = new Array(this.length);
              for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
              (e.length = this.length),
                (e.negative = this.negative),
                (e.red = this.red);
            }),
            (o.prototype.clone = function () {
              var e = new o(null);
              return this.copy(e), e;
            }),
            (o.prototype._expand = function (e) {
              for (; this.length < e; ) this.words[this.length++] = 0;
              return this;
            }),
            (o.prototype.strip = function () {
              for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                this.length--;
              return this._normSign();
            }),
            (o.prototype._normSign = function () {
              return (
                1 === this.length && 0 === this.words[0] && (this.negative = 0),
                this
              );
            }),
            (o.prototype.inspect = function () {
              return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
            });
          var c = [
              '',
              '0',
              '00',
              '000',
              '0000',
              '00000',
              '000000',
              '0000000',
              '00000000',
              '000000000',
              '0000000000',
              '00000000000',
              '000000000000',
              '0000000000000',
              '00000000000000',
              '000000000000000',
              '0000000000000000',
              '00000000000000000',
              '000000000000000000',
              '0000000000000000000',
              '00000000000000000000',
              '000000000000000000000',
              '0000000000000000000000',
              '00000000000000000000000',
              '000000000000000000000000',
              '0000000000000000000000000',
            ],
            f = [
              0,
              0,
              25,
              16,
              12,
              11,
              10,
              9,
              8,
              8,
              7,
              7,
              7,
              7,
              6,
              6,
              6,
              6,
              6,
              6,
              6,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
            ],
            l = [
              0,
              0,
              33554432,
              43046721,
              16777216,
              48828125,
              60466176,
              40353607,
              16777216,
              43046721,
              1e7,
              19487171,
              35831808,
              62748517,
              7529536,
              11390625,
              16777216,
              24137569,
              34012224,
              47045881,
              64e6,
              4084101,
              5153632,
              6436343,
              7962624,
              9765625,
              11881376,
              14348907,
              17210368,
              20511149,
              243e5,
              28629151,
              33554432,
              39135393,
              45435424,
              52521875,
              60466176,
            ];
          function d(e, t, r) {
            r.negative = t.negative ^ e.negative;
            var n = (e.length + t.length) | 0;
            (r.length = n), (n = (n - 1) | 0);
            var i = 0 | e.words[0],
              o = 0 | t.words[0],
              a = i * o,
              s = 67108863 & a,
              u = (a / 67108864) | 0;
            r.words[0] = s;
            for (var c = 1; c < n; c++) {
              for (
                var f = u >>> 26,
                  l = 67108863 & u,
                  d = Math.min(c, t.length - 1),
                  h = Math.max(0, c - e.length + 1);
                h <= d;
                h++
              ) {
                var p = (c - h) | 0;
                (f +=
                  ((a = (i = 0 | e.words[p]) * (o = 0 | t.words[h]) + l) /
                    67108864) |
                  0),
                  (l = 67108863 & a);
              }
              (r.words[c] = 0 | l), (u = 0 | f);
            }
            return 0 !== u ? (r.words[c] = 0 | u) : r.length--, r.strip();
          }
          (o.prototype.toString = function (e, t) {
            var r;
            if (((t = 0 | t || 1), 16 === (e = e || 10) || 'hex' === e)) {
              r = '';
              for (var i = 0, o = 0, a = 0; a < this.length; a++) {
                var s = this.words[a],
                  u = (16777215 & ((s << i) | o)).toString(16);
                (r =
                  0 !== (o = (s >>> (24 - i)) & 16777215) ||
                  a !== this.length - 1
                    ? c[6 - u.length] + u + r
                    : u + r),
                  (i += 2) >= 26 && ((i -= 26), a--);
              }
              for (0 !== o && (r = o.toString(16) + r); r.length % t != 0; )
                r = '0' + r;
              return 0 !== this.negative && (r = '-' + r), r;
            }
            if (e === (0 | e) && e >= 2 && e <= 36) {
              var d = f[e],
                h = l[e];
              r = '';
              var p = this.clone();
              for (p.negative = 0; !p.isZero(); ) {
                var m = p.modn(h).toString(e);
                r = (p = p.idivn(h)).isZero() ? m + r : c[d - m.length] + m + r;
              }
              for (this.isZero() && (r = '0' + r); r.length % t != 0; )
                r = '0' + r;
              return 0 !== this.negative && (r = '-' + r), r;
            }
            n(!1, 'Base should be between 2 and 36');
          }),
            (o.prototype.toNumber = function () {
              var e = this.words[0];
              return (
                2 === this.length
                  ? (e += 67108864 * this.words[1])
                  : 3 === this.length && 1 === this.words[2]
                  ? (e += 4503599627370496 + 67108864 * this.words[1])
                  : this.length > 2 &&
                    n(!1, 'Number can only safely store up to 53 bits'),
                0 !== this.negative ? -e : e
              );
            }),
            (o.prototype.toJSON = function () {
              return this.toString(16);
            }),
            (o.prototype.toBuffer = function (e, t) {
              return n(void 0 !== a), this.toArrayLike(a, e, t);
            }),
            (o.prototype.toArray = function (e, t) {
              return this.toArrayLike(Array, e, t);
            }),
            (o.prototype.toArrayLike = function (e, t, r) {
              var i = this.byteLength(),
                o = r || Math.max(1, i);
              n(i <= o, 'byte array longer than desired length'),
                n(o > 0, 'Requested array length <= 0'),
                this.strip();
              var a,
                s,
                u = 'le' === t,
                c = new e(o),
                f = this.clone();
              if (u) {
                for (s = 0; !f.isZero(); s++)
                  (a = f.andln(255)), f.iushrn(8), (c[s] = a);
                for (; s < o; s++) c[s] = 0;
              } else {
                for (s = 0; s < o - i; s++) c[s] = 0;
                for (s = 0; !f.isZero(); s++)
                  (a = f.andln(255)), f.iushrn(8), (c[o - s - 1] = a);
              }
              return c;
            }),
            Math.clz32
              ? (o.prototype._countBits = function (e) {
                  return 32 - Math.clz32(e);
                })
              : (o.prototype._countBits = function (e) {
                  var t = e,
                    r = 0;
                  return (
                    t >= 4096 && ((r += 13), (t >>>= 13)),
                    t >= 64 && ((r += 7), (t >>>= 7)),
                    t >= 8 && ((r += 4), (t >>>= 4)),
                    t >= 2 && ((r += 2), (t >>>= 2)),
                    r + t
                  );
                }),
            (o.prototype._zeroBits = function (e) {
              if (0 === e) return 26;
              var t = e,
                r = 0;
              return (
                0 == (8191 & t) && ((r += 13), (t >>>= 13)),
                0 == (127 & t) && ((r += 7), (t >>>= 7)),
                0 == (15 & t) && ((r += 4), (t >>>= 4)),
                0 == (3 & t) && ((r += 2), (t >>>= 2)),
                0 == (1 & t) && r++,
                r
              );
            }),
            (o.prototype.bitLength = function () {
              var e = this.words[this.length - 1],
                t = this._countBits(e);
              return 26 * (this.length - 1) + t;
            }),
            (o.prototype.zeroBits = function () {
              if (this.isZero()) return 0;
              for (var e = 0, t = 0; t < this.length; t++) {
                var r = this._zeroBits(this.words[t]);
                if (((e += r), 26 !== r)) break;
              }
              return e;
            }),
            (o.prototype.byteLength = function () {
              return Math.ceil(this.bitLength() / 8);
            }),
            (o.prototype.toTwos = function (e) {
              return 0 !== this.negative
                ? this.abs().inotn(e).iaddn(1)
                : this.clone();
            }),
            (o.prototype.fromTwos = function (e) {
              return this.testn(e - 1)
                ? this.notn(e).iaddn(1).ineg()
                : this.clone();
            }),
            (o.prototype.isNeg = function () {
              return 0 !== this.negative;
            }),
            (o.prototype.neg = function () {
              return this.clone().ineg();
            }),
            (o.prototype.ineg = function () {
              return this.isZero() || (this.negative ^= 1), this;
            }),
            (o.prototype.iuor = function (e) {
              for (; this.length < e.length; ) this.words[this.length++] = 0;
              for (var t = 0; t < e.length; t++)
                this.words[t] = this.words[t] | e.words[t];
              return this.strip();
            }),
            (o.prototype.ior = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuor(e);
            }),
            (o.prototype.or = function (e) {
              return this.length > e.length
                ? this.clone().ior(e)
                : e.clone().ior(this);
            }),
            (o.prototype.uor = function (e) {
              return this.length > e.length
                ? this.clone().iuor(e)
                : e.clone().iuor(this);
            }),
            (o.prototype.iuand = function (e) {
              var t;
              t = this.length > e.length ? e : this;
              for (var r = 0; r < t.length; r++)
                this.words[r] = this.words[r] & e.words[r];
              return (this.length = t.length), this.strip();
            }),
            (o.prototype.iand = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuand(e);
            }),
            (o.prototype.and = function (e) {
              return this.length > e.length
                ? this.clone().iand(e)
                : e.clone().iand(this);
            }),
            (o.prototype.uand = function (e) {
              return this.length > e.length
                ? this.clone().iuand(e)
                : e.clone().iuand(this);
            }),
            (o.prototype.iuxor = function (e) {
              var t, r;
              this.length > e.length
                ? ((t = this), (r = e))
                : ((t = e), (r = this));
              for (var n = 0; n < r.length; n++)
                this.words[n] = t.words[n] ^ r.words[n];
              if (this !== t)
                for (; n < t.length; n++) this.words[n] = t.words[n];
              return (this.length = t.length), this.strip();
            }),
            (o.prototype.ixor = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuxor(e);
            }),
            (o.prototype.xor = function (e) {
              return this.length > e.length
                ? this.clone().ixor(e)
                : e.clone().ixor(this);
            }),
            (o.prototype.uxor = function (e) {
              return this.length > e.length
                ? this.clone().iuxor(e)
                : e.clone().iuxor(this);
            }),
            (o.prototype.inotn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = 0 | Math.ceil(e / 26),
                r = e % 26;
              this._expand(t), r > 0 && t--;
              for (var i = 0; i < t; i++)
                this.words[i] = 67108863 & ~this.words[i];
              return (
                r > 0 &&
                  (this.words[i] = ~this.words[i] & (67108863 >> (26 - r))),
                this.strip()
              );
            }),
            (o.prototype.notn = function (e) {
              return this.clone().inotn(e);
            }),
            (o.prototype.setn = function (e, t) {
              n('number' == typeof e && e >= 0);
              var r = (e / 26) | 0,
                i = e % 26;
              return (
                this._expand(r + 1),
                (this.words[r] = t
                  ? this.words[r] | (1 << i)
                  : this.words[r] & ~(1 << i)),
                this.strip()
              );
            }),
            (o.prototype.iadd = function (e) {
              var t, r, n;
              if (0 !== this.negative && 0 === e.negative)
                return (
                  (this.negative = 0),
                  (t = this.isub(e)),
                  (this.negative ^= 1),
                  this._normSign()
                );
              if (0 === this.negative && 0 !== e.negative)
                return (
                  (e.negative = 0),
                  (t = this.isub(e)),
                  (e.negative = 1),
                  t._normSign()
                );
              this.length > e.length
                ? ((r = this), (n = e))
                : ((r = e), (n = this));
              for (var i = 0, o = 0; o < n.length; o++)
                (t = (0 | r.words[o]) + (0 | n.words[o]) + i),
                  (this.words[o] = 67108863 & t),
                  (i = t >>> 26);
              for (; 0 !== i && o < r.length; o++)
                (t = (0 | r.words[o]) + i),
                  (this.words[o] = 67108863 & t),
                  (i = t >>> 26);
              if (((this.length = r.length), 0 !== i))
                (this.words[this.length] = i), this.length++;
              else if (r !== this)
                for (; o < r.length; o++) this.words[o] = r.words[o];
              return this;
            }),
            (o.prototype.add = function (e) {
              var t;
              return 0 !== e.negative && 0 === this.negative
                ? ((e.negative = 0), (t = this.sub(e)), (e.negative ^= 1), t)
                : 0 === e.negative && 0 !== this.negative
                ? ((this.negative = 0),
                  (t = e.sub(this)),
                  (this.negative = 1),
                  t)
                : this.length > e.length
                ? this.clone().iadd(e)
                : e.clone().iadd(this);
            }),
            (o.prototype.isub = function (e) {
              if (0 !== e.negative) {
                e.negative = 0;
                var t = this.iadd(e);
                return (e.negative = 1), t._normSign();
              }
              if (0 !== this.negative)
                return (
                  (this.negative = 0),
                  this.iadd(e),
                  (this.negative = 1),
                  this._normSign()
                );
              var r,
                n,
                i = this.cmp(e);
              if (0 === i)
                return (
                  (this.negative = 0),
                  (this.length = 1),
                  (this.words[0] = 0),
                  this
                );
              i > 0 ? ((r = this), (n = e)) : ((r = e), (n = this));
              for (var o = 0, a = 0; a < n.length; a++)
                (o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26),
                  (this.words[a] = 67108863 & t);
              for (; 0 !== o && a < r.length; a++)
                (o = (t = (0 | r.words[a]) + o) >> 26),
                  (this.words[a] = 67108863 & t);
              if (0 === o && a < r.length && r !== this)
                for (; a < r.length; a++) this.words[a] = r.words[a];
              return (
                (this.length = Math.max(this.length, a)),
                r !== this && (this.negative = 1),
                this.strip()
              );
            }),
            (o.prototype.sub = function (e) {
              return this.clone().isub(e);
            });
          var h = function (e, t, r) {
            var n,
              i,
              o,
              a = e.words,
              s = t.words,
              u = r.words,
              c = 0,
              f = 0 | a[0],
              l = 8191 & f,
              d = f >>> 13,
              h = 0 | a[1],
              p = 8191 & h,
              m = h >>> 13,
              b = 0 | a[2],
              g = 8191 & b,
              v = b >>> 13,
              y = 0 | a[3],
              w = 8191 & y,
              _ = y >>> 13,
              S = 0 | a[4],
              M = 8191 & S,
              E = S >>> 13,
              k = 0 | a[5],
              x = 8191 & k,
              T = k >>> 13,
              O = 0 | a[6],
              I = 8191 & O,
              A = O >>> 13,
              P = 0 | a[7],
              N = 8191 & P,
              B = P >>> 13,
              C = 0 | a[8],
              R = 8191 & C,
              j = C >>> 13,
              z = 0 | a[9],
              q = 8191 & z,
              U = z >>> 13,
              L = 0 | s[0],
              H = 8191 & L,
              F = L >>> 13,
              D = 0 | s[1],
              K = 8191 & D,
              W = D >>> 13,
              V = 0 | s[2],
              G = 8191 & V,
              X = V >>> 13,
              $ = 0 | s[3],
              J = 8191 & $,
              Z = $ >>> 13,
              Y = 0 | s[4],
              Q = 8191 & Y,
              ee = Y >>> 13,
              te = 0 | s[5],
              re = 8191 & te,
              ne = te >>> 13,
              ie = 0 | s[6],
              oe = 8191 & ie,
              ae = ie >>> 13,
              se = 0 | s[7],
              ue = 8191 & se,
              ce = se >>> 13,
              fe = 0 | s[8],
              le = 8191 & fe,
              de = fe >>> 13,
              he = 0 | s[9],
              pe = 8191 & he,
              me = he >>> 13;
            (r.negative = e.negative ^ t.negative), (r.length = 19);
            var be =
              (((c + (n = Math.imul(l, H))) | 0) +
                ((8191 & (i = ((i = Math.imul(l, F)) + Math.imul(d, H)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = Math.imul(d, F)) + (i >>> 13)) | 0) + (be >>> 26)) | 0),
              (be &= 67108863),
              (n = Math.imul(p, H)),
              (i = ((i = Math.imul(p, F)) + Math.imul(m, H)) | 0),
              (o = Math.imul(m, F));
            var ge =
              (((c + (n = (n + Math.imul(l, K)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, W)) | 0) + Math.imul(d, K)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, W)) | 0) + (i >>> 13)) | 0) +
                (ge >>> 26)) |
              0),
              (ge &= 67108863),
              (n = Math.imul(g, H)),
              (i = ((i = Math.imul(g, F)) + Math.imul(v, H)) | 0),
              (o = Math.imul(v, F)),
              (n = (n + Math.imul(p, K)) | 0),
              (i = ((i = (i + Math.imul(p, W)) | 0) + Math.imul(m, K)) | 0),
              (o = (o + Math.imul(m, W)) | 0);
            var ve =
              (((c + (n = (n + Math.imul(l, G)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, X)) | 0) + Math.imul(d, G)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, X)) | 0) + (i >>> 13)) | 0) +
                (ve >>> 26)) |
              0),
              (ve &= 67108863),
              (n = Math.imul(w, H)),
              (i = ((i = Math.imul(w, F)) + Math.imul(_, H)) | 0),
              (o = Math.imul(_, F)),
              (n = (n + Math.imul(g, K)) | 0),
              (i = ((i = (i + Math.imul(g, W)) | 0) + Math.imul(v, K)) | 0),
              (o = (o + Math.imul(v, W)) | 0),
              (n = (n + Math.imul(p, G)) | 0),
              (i = ((i = (i + Math.imul(p, X)) | 0) + Math.imul(m, G)) | 0),
              (o = (o + Math.imul(m, X)) | 0);
            var ye =
              (((c + (n = (n + Math.imul(l, J)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, Z)) | 0) + Math.imul(d, J)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, Z)) | 0) + (i >>> 13)) | 0) +
                (ye >>> 26)) |
              0),
              (ye &= 67108863),
              (n = Math.imul(M, H)),
              (i = ((i = Math.imul(M, F)) + Math.imul(E, H)) | 0),
              (o = Math.imul(E, F)),
              (n = (n + Math.imul(w, K)) | 0),
              (i = ((i = (i + Math.imul(w, W)) | 0) + Math.imul(_, K)) | 0),
              (o = (o + Math.imul(_, W)) | 0),
              (n = (n + Math.imul(g, G)) | 0),
              (i = ((i = (i + Math.imul(g, X)) | 0) + Math.imul(v, G)) | 0),
              (o = (o + Math.imul(v, X)) | 0),
              (n = (n + Math.imul(p, J)) | 0),
              (i = ((i = (i + Math.imul(p, Z)) | 0) + Math.imul(m, J)) | 0),
              (o = (o + Math.imul(m, Z)) | 0);
            var we =
              (((c + (n = (n + Math.imul(l, Q)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ee)) | 0) + Math.imul(d, Q)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ee)) | 0) + (i >>> 13)) | 0) +
                (we >>> 26)) |
              0),
              (we &= 67108863),
              (n = Math.imul(x, H)),
              (i = ((i = Math.imul(x, F)) + Math.imul(T, H)) | 0),
              (o = Math.imul(T, F)),
              (n = (n + Math.imul(M, K)) | 0),
              (i = ((i = (i + Math.imul(M, W)) | 0) + Math.imul(E, K)) | 0),
              (o = (o + Math.imul(E, W)) | 0),
              (n = (n + Math.imul(w, G)) | 0),
              (i = ((i = (i + Math.imul(w, X)) | 0) + Math.imul(_, G)) | 0),
              (o = (o + Math.imul(_, X)) | 0),
              (n = (n + Math.imul(g, J)) | 0),
              (i = ((i = (i + Math.imul(g, Z)) | 0) + Math.imul(v, J)) | 0),
              (o = (o + Math.imul(v, Z)) | 0),
              (n = (n + Math.imul(p, Q)) | 0),
              (i = ((i = (i + Math.imul(p, ee)) | 0) + Math.imul(m, Q)) | 0),
              (o = (o + Math.imul(m, ee)) | 0);
            var _e =
              (((c + (n = (n + Math.imul(l, re)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ne)) | 0) + Math.imul(d, re)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ne)) | 0) + (i >>> 13)) | 0) +
                (_e >>> 26)) |
              0),
              (_e &= 67108863),
              (n = Math.imul(I, H)),
              (i = ((i = Math.imul(I, F)) + Math.imul(A, H)) | 0),
              (o = Math.imul(A, F)),
              (n = (n + Math.imul(x, K)) | 0),
              (i = ((i = (i + Math.imul(x, W)) | 0) + Math.imul(T, K)) | 0),
              (o = (o + Math.imul(T, W)) | 0),
              (n = (n + Math.imul(M, G)) | 0),
              (i = ((i = (i + Math.imul(M, X)) | 0) + Math.imul(E, G)) | 0),
              (o = (o + Math.imul(E, X)) | 0),
              (n = (n + Math.imul(w, J)) | 0),
              (i = ((i = (i + Math.imul(w, Z)) | 0) + Math.imul(_, J)) | 0),
              (o = (o + Math.imul(_, Z)) | 0),
              (n = (n + Math.imul(g, Q)) | 0),
              (i = ((i = (i + Math.imul(g, ee)) | 0) + Math.imul(v, Q)) | 0),
              (o = (o + Math.imul(v, ee)) | 0),
              (n = (n + Math.imul(p, re)) | 0),
              (i = ((i = (i + Math.imul(p, ne)) | 0) + Math.imul(m, re)) | 0),
              (o = (o + Math.imul(m, ne)) | 0);
            var Se =
              (((c + (n = (n + Math.imul(l, oe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ae)) | 0) + Math.imul(d, oe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ae)) | 0) + (i >>> 13)) | 0) +
                (Se >>> 26)) |
              0),
              (Se &= 67108863),
              (n = Math.imul(N, H)),
              (i = ((i = Math.imul(N, F)) + Math.imul(B, H)) | 0),
              (o = Math.imul(B, F)),
              (n = (n + Math.imul(I, K)) | 0),
              (i = ((i = (i + Math.imul(I, W)) | 0) + Math.imul(A, K)) | 0),
              (o = (o + Math.imul(A, W)) | 0),
              (n = (n + Math.imul(x, G)) | 0),
              (i = ((i = (i + Math.imul(x, X)) | 0) + Math.imul(T, G)) | 0),
              (o = (o + Math.imul(T, X)) | 0),
              (n = (n + Math.imul(M, J)) | 0),
              (i = ((i = (i + Math.imul(M, Z)) | 0) + Math.imul(E, J)) | 0),
              (o = (o + Math.imul(E, Z)) | 0),
              (n = (n + Math.imul(w, Q)) | 0),
              (i = ((i = (i + Math.imul(w, ee)) | 0) + Math.imul(_, Q)) | 0),
              (o = (o + Math.imul(_, ee)) | 0),
              (n = (n + Math.imul(g, re)) | 0),
              (i = ((i = (i + Math.imul(g, ne)) | 0) + Math.imul(v, re)) | 0),
              (o = (o + Math.imul(v, ne)) | 0),
              (n = (n + Math.imul(p, oe)) | 0),
              (i = ((i = (i + Math.imul(p, ae)) | 0) + Math.imul(m, oe)) | 0),
              (o = (o + Math.imul(m, ae)) | 0);
            var Me =
              (((c + (n = (n + Math.imul(l, ue)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ce)) | 0) + Math.imul(d, ue)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ce)) | 0) + (i >>> 13)) | 0) +
                (Me >>> 26)) |
              0),
              (Me &= 67108863),
              (n = Math.imul(R, H)),
              (i = ((i = Math.imul(R, F)) + Math.imul(j, H)) | 0),
              (o = Math.imul(j, F)),
              (n = (n + Math.imul(N, K)) | 0),
              (i = ((i = (i + Math.imul(N, W)) | 0) + Math.imul(B, K)) | 0),
              (o = (o + Math.imul(B, W)) | 0),
              (n = (n + Math.imul(I, G)) | 0),
              (i = ((i = (i + Math.imul(I, X)) | 0) + Math.imul(A, G)) | 0),
              (o = (o + Math.imul(A, X)) | 0),
              (n = (n + Math.imul(x, J)) | 0),
              (i = ((i = (i + Math.imul(x, Z)) | 0) + Math.imul(T, J)) | 0),
              (o = (o + Math.imul(T, Z)) | 0),
              (n = (n + Math.imul(M, Q)) | 0),
              (i = ((i = (i + Math.imul(M, ee)) | 0) + Math.imul(E, Q)) | 0),
              (o = (o + Math.imul(E, ee)) | 0),
              (n = (n + Math.imul(w, re)) | 0),
              (i = ((i = (i + Math.imul(w, ne)) | 0) + Math.imul(_, re)) | 0),
              (o = (o + Math.imul(_, ne)) | 0),
              (n = (n + Math.imul(g, oe)) | 0),
              (i = ((i = (i + Math.imul(g, ae)) | 0) + Math.imul(v, oe)) | 0),
              (o = (o + Math.imul(v, ae)) | 0),
              (n = (n + Math.imul(p, ue)) | 0),
              (i = ((i = (i + Math.imul(p, ce)) | 0) + Math.imul(m, ue)) | 0),
              (o = (o + Math.imul(m, ce)) | 0);
            var Ee =
              (((c + (n = (n + Math.imul(l, le)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, de)) | 0) + Math.imul(d, le)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, de)) | 0) + (i >>> 13)) | 0) +
                (Ee >>> 26)) |
              0),
              (Ee &= 67108863),
              (n = Math.imul(q, H)),
              (i = ((i = Math.imul(q, F)) + Math.imul(U, H)) | 0),
              (o = Math.imul(U, F)),
              (n = (n + Math.imul(R, K)) | 0),
              (i = ((i = (i + Math.imul(R, W)) | 0) + Math.imul(j, K)) | 0),
              (o = (o + Math.imul(j, W)) | 0),
              (n = (n + Math.imul(N, G)) | 0),
              (i = ((i = (i + Math.imul(N, X)) | 0) + Math.imul(B, G)) | 0),
              (o = (o + Math.imul(B, X)) | 0),
              (n = (n + Math.imul(I, J)) | 0),
              (i = ((i = (i + Math.imul(I, Z)) | 0) + Math.imul(A, J)) | 0),
              (o = (o + Math.imul(A, Z)) | 0),
              (n = (n + Math.imul(x, Q)) | 0),
              (i = ((i = (i + Math.imul(x, ee)) | 0) + Math.imul(T, Q)) | 0),
              (o = (o + Math.imul(T, ee)) | 0),
              (n = (n + Math.imul(M, re)) | 0),
              (i = ((i = (i + Math.imul(M, ne)) | 0) + Math.imul(E, re)) | 0),
              (o = (o + Math.imul(E, ne)) | 0),
              (n = (n + Math.imul(w, oe)) | 0),
              (i = ((i = (i + Math.imul(w, ae)) | 0) + Math.imul(_, oe)) | 0),
              (o = (o + Math.imul(_, ae)) | 0),
              (n = (n + Math.imul(g, ue)) | 0),
              (i = ((i = (i + Math.imul(g, ce)) | 0) + Math.imul(v, ue)) | 0),
              (o = (o + Math.imul(v, ce)) | 0),
              (n = (n + Math.imul(p, le)) | 0),
              (i = ((i = (i + Math.imul(p, de)) | 0) + Math.imul(m, le)) | 0),
              (o = (o + Math.imul(m, de)) | 0);
            var ke =
              (((c + (n = (n + Math.imul(l, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, me)) | 0) + Math.imul(d, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, me)) | 0) + (i >>> 13)) | 0) +
                (ke >>> 26)) |
              0),
              (ke &= 67108863),
              (n = Math.imul(q, K)),
              (i = ((i = Math.imul(q, W)) + Math.imul(U, K)) | 0),
              (o = Math.imul(U, W)),
              (n = (n + Math.imul(R, G)) | 0),
              (i = ((i = (i + Math.imul(R, X)) | 0) + Math.imul(j, G)) | 0),
              (o = (o + Math.imul(j, X)) | 0),
              (n = (n + Math.imul(N, J)) | 0),
              (i = ((i = (i + Math.imul(N, Z)) | 0) + Math.imul(B, J)) | 0),
              (o = (o + Math.imul(B, Z)) | 0),
              (n = (n + Math.imul(I, Q)) | 0),
              (i = ((i = (i + Math.imul(I, ee)) | 0) + Math.imul(A, Q)) | 0),
              (o = (o + Math.imul(A, ee)) | 0),
              (n = (n + Math.imul(x, re)) | 0),
              (i = ((i = (i + Math.imul(x, ne)) | 0) + Math.imul(T, re)) | 0),
              (o = (o + Math.imul(T, ne)) | 0),
              (n = (n + Math.imul(M, oe)) | 0),
              (i = ((i = (i + Math.imul(M, ae)) | 0) + Math.imul(E, oe)) | 0),
              (o = (o + Math.imul(E, ae)) | 0),
              (n = (n + Math.imul(w, ue)) | 0),
              (i = ((i = (i + Math.imul(w, ce)) | 0) + Math.imul(_, ue)) | 0),
              (o = (o + Math.imul(_, ce)) | 0),
              (n = (n + Math.imul(g, le)) | 0),
              (i = ((i = (i + Math.imul(g, de)) | 0) + Math.imul(v, le)) | 0),
              (o = (o + Math.imul(v, de)) | 0);
            var xe =
              (((c + (n = (n + Math.imul(p, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(p, me)) | 0) + Math.imul(m, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(m, me)) | 0) + (i >>> 13)) | 0) +
                (xe >>> 26)) |
              0),
              (xe &= 67108863),
              (n = Math.imul(q, G)),
              (i = ((i = Math.imul(q, X)) + Math.imul(U, G)) | 0),
              (o = Math.imul(U, X)),
              (n = (n + Math.imul(R, J)) | 0),
              (i = ((i = (i + Math.imul(R, Z)) | 0) + Math.imul(j, J)) | 0),
              (o = (o + Math.imul(j, Z)) | 0),
              (n = (n + Math.imul(N, Q)) | 0),
              (i = ((i = (i + Math.imul(N, ee)) | 0) + Math.imul(B, Q)) | 0),
              (o = (o + Math.imul(B, ee)) | 0),
              (n = (n + Math.imul(I, re)) | 0),
              (i = ((i = (i + Math.imul(I, ne)) | 0) + Math.imul(A, re)) | 0),
              (o = (o + Math.imul(A, ne)) | 0),
              (n = (n + Math.imul(x, oe)) | 0),
              (i = ((i = (i + Math.imul(x, ae)) | 0) + Math.imul(T, oe)) | 0),
              (o = (o + Math.imul(T, ae)) | 0),
              (n = (n + Math.imul(M, ue)) | 0),
              (i = ((i = (i + Math.imul(M, ce)) | 0) + Math.imul(E, ue)) | 0),
              (o = (o + Math.imul(E, ce)) | 0),
              (n = (n + Math.imul(w, le)) | 0),
              (i = ((i = (i + Math.imul(w, de)) | 0) + Math.imul(_, le)) | 0),
              (o = (o + Math.imul(_, de)) | 0);
            var Te =
              (((c + (n = (n + Math.imul(g, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(g, me)) | 0) + Math.imul(v, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(v, me)) | 0) + (i >>> 13)) | 0) +
                (Te >>> 26)) |
              0),
              (Te &= 67108863),
              (n = Math.imul(q, J)),
              (i = ((i = Math.imul(q, Z)) + Math.imul(U, J)) | 0),
              (o = Math.imul(U, Z)),
              (n = (n + Math.imul(R, Q)) | 0),
              (i = ((i = (i + Math.imul(R, ee)) | 0) + Math.imul(j, Q)) | 0),
              (o = (o + Math.imul(j, ee)) | 0),
              (n = (n + Math.imul(N, re)) | 0),
              (i = ((i = (i + Math.imul(N, ne)) | 0) + Math.imul(B, re)) | 0),
              (o = (o + Math.imul(B, ne)) | 0),
              (n = (n + Math.imul(I, oe)) | 0),
              (i = ((i = (i + Math.imul(I, ae)) | 0) + Math.imul(A, oe)) | 0),
              (o = (o + Math.imul(A, ae)) | 0),
              (n = (n + Math.imul(x, ue)) | 0),
              (i = ((i = (i + Math.imul(x, ce)) | 0) + Math.imul(T, ue)) | 0),
              (o = (o + Math.imul(T, ce)) | 0),
              (n = (n + Math.imul(M, le)) | 0),
              (i = ((i = (i + Math.imul(M, de)) | 0) + Math.imul(E, le)) | 0),
              (o = (o + Math.imul(E, de)) | 0);
            var Oe =
              (((c + (n = (n + Math.imul(w, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(w, me)) | 0) + Math.imul(_, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(_, me)) | 0) + (i >>> 13)) | 0) +
                (Oe >>> 26)) |
              0),
              (Oe &= 67108863),
              (n = Math.imul(q, Q)),
              (i = ((i = Math.imul(q, ee)) + Math.imul(U, Q)) | 0),
              (o = Math.imul(U, ee)),
              (n = (n + Math.imul(R, re)) | 0),
              (i = ((i = (i + Math.imul(R, ne)) | 0) + Math.imul(j, re)) | 0),
              (o = (o + Math.imul(j, ne)) | 0),
              (n = (n + Math.imul(N, oe)) | 0),
              (i = ((i = (i + Math.imul(N, ae)) | 0) + Math.imul(B, oe)) | 0),
              (o = (o + Math.imul(B, ae)) | 0),
              (n = (n + Math.imul(I, ue)) | 0),
              (i = ((i = (i + Math.imul(I, ce)) | 0) + Math.imul(A, ue)) | 0),
              (o = (o + Math.imul(A, ce)) | 0),
              (n = (n + Math.imul(x, le)) | 0),
              (i = ((i = (i + Math.imul(x, de)) | 0) + Math.imul(T, le)) | 0),
              (o = (o + Math.imul(T, de)) | 0);
            var Ie =
              (((c + (n = (n + Math.imul(M, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(M, me)) | 0) + Math.imul(E, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(E, me)) | 0) + (i >>> 13)) | 0) +
                (Ie >>> 26)) |
              0),
              (Ie &= 67108863),
              (n = Math.imul(q, re)),
              (i = ((i = Math.imul(q, ne)) + Math.imul(U, re)) | 0),
              (o = Math.imul(U, ne)),
              (n = (n + Math.imul(R, oe)) | 0),
              (i = ((i = (i + Math.imul(R, ae)) | 0) + Math.imul(j, oe)) | 0),
              (o = (o + Math.imul(j, ae)) | 0),
              (n = (n + Math.imul(N, ue)) | 0),
              (i = ((i = (i + Math.imul(N, ce)) | 0) + Math.imul(B, ue)) | 0),
              (o = (o + Math.imul(B, ce)) | 0),
              (n = (n + Math.imul(I, le)) | 0),
              (i = ((i = (i + Math.imul(I, de)) | 0) + Math.imul(A, le)) | 0),
              (o = (o + Math.imul(A, de)) | 0);
            var Ae =
              (((c + (n = (n + Math.imul(x, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(x, me)) | 0) + Math.imul(T, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(T, me)) | 0) + (i >>> 13)) | 0) +
                (Ae >>> 26)) |
              0),
              (Ae &= 67108863),
              (n = Math.imul(q, oe)),
              (i = ((i = Math.imul(q, ae)) + Math.imul(U, oe)) | 0),
              (o = Math.imul(U, ae)),
              (n = (n + Math.imul(R, ue)) | 0),
              (i = ((i = (i + Math.imul(R, ce)) | 0) + Math.imul(j, ue)) | 0),
              (o = (o + Math.imul(j, ce)) | 0),
              (n = (n + Math.imul(N, le)) | 0),
              (i = ((i = (i + Math.imul(N, de)) | 0) + Math.imul(B, le)) | 0),
              (o = (o + Math.imul(B, de)) | 0);
            var Pe =
              (((c + (n = (n + Math.imul(I, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(I, me)) | 0) + Math.imul(A, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(A, me)) | 0) + (i >>> 13)) | 0) +
                (Pe >>> 26)) |
              0),
              (Pe &= 67108863),
              (n = Math.imul(q, ue)),
              (i = ((i = Math.imul(q, ce)) + Math.imul(U, ue)) | 0),
              (o = Math.imul(U, ce)),
              (n = (n + Math.imul(R, le)) | 0),
              (i = ((i = (i + Math.imul(R, de)) | 0) + Math.imul(j, le)) | 0),
              (o = (o + Math.imul(j, de)) | 0);
            var Ne =
              (((c + (n = (n + Math.imul(N, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(N, me)) | 0) + Math.imul(B, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(B, me)) | 0) + (i >>> 13)) | 0) +
                (Ne >>> 26)) |
              0),
              (Ne &= 67108863),
              (n = Math.imul(q, le)),
              (i = ((i = Math.imul(q, de)) + Math.imul(U, le)) | 0),
              (o = Math.imul(U, de));
            var Be =
              (((c + (n = (n + Math.imul(R, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(R, me)) | 0) + Math.imul(j, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(j, me)) | 0) + (i >>> 13)) | 0) +
                (Be >>> 26)) |
              0),
              (Be &= 67108863);
            var Ce =
              (((c + (n = Math.imul(q, pe))) | 0) +
                ((8191 &
                  (i = ((i = Math.imul(q, me)) + Math.imul(U, pe)) | 0)) <<
                  13)) |
              0;
            return (
              (c =
                ((((o = Math.imul(U, me)) + (i >>> 13)) | 0) + (Ce >>> 26)) |
                0),
              (Ce &= 67108863),
              (u[0] = be),
              (u[1] = ge),
              (u[2] = ve),
              (u[3] = ye),
              (u[4] = we),
              (u[5] = _e),
              (u[6] = Se),
              (u[7] = Me),
              (u[8] = Ee),
              (u[9] = ke),
              (u[10] = xe),
              (u[11] = Te),
              (u[12] = Oe),
              (u[13] = Ie),
              (u[14] = Ae),
              (u[15] = Pe),
              (u[16] = Ne),
              (u[17] = Be),
              (u[18] = Ce),
              0 !== c && ((u[19] = c), r.length++),
              r
            );
          };
          function p(e, t, r) {
            return new m().mulp(e, t, r);
          }
          function m(e, t) {
            (this.x = e), (this.y = t);
          }
          Math.imul || (h = d),
            (o.prototype.mulTo = function (e, t) {
              var r = this.length + e.length;
              return 10 === this.length && 10 === e.length
                ? h(this, e, t)
                : r < 63
                ? d(this, e, t)
                : r < 1024
                ? (function (e, t, r) {
                    (r.negative = t.negative ^ e.negative),
                      (r.length = e.length + t.length);
                    for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
                      var a = i;
                      i = 0;
                      for (
                        var s = 67108863 & n,
                          u = Math.min(o, t.length - 1),
                          c = Math.max(0, o - e.length + 1);
                        c <= u;
                        c++
                      ) {
                        var f = o - c,
                          l = (0 | e.words[f]) * (0 | t.words[c]),
                          d = 67108863 & l;
                        (s = 67108863 & (d = (d + s) | 0)),
                          (i +=
                            (a =
                              ((a = (a + ((l / 67108864) | 0)) | 0) +
                                (d >>> 26)) |
                              0) >>> 26),
                          (a &= 67108863);
                      }
                      (r.words[o] = s), (n = a), (a = i);
                    }
                    return 0 !== n ? (r.words[o] = n) : r.length--, r.strip();
                  })(this, e, t)
                : p(this, e, t);
            }),
            (m.prototype.makeRBT = function (e) {
              for (
                var t = new Array(e), r = o.prototype._countBits(e) - 1, n = 0;
                n < e;
                n++
              )
                t[n] = this.revBin(n, r, e);
              return t;
            }),
            (m.prototype.revBin = function (e, t, r) {
              if (0 === e || e === r - 1) return e;
              for (var n = 0, i = 0; i < t; i++)
                (n |= (1 & e) << (t - i - 1)), (e >>= 1);
              return n;
            }),
            (m.prototype.permute = function (e, t, r, n, i, o) {
              for (var a = 0; a < o; a++) (n[a] = t[e[a]]), (i[a] = r[e[a]]);
            }),
            (m.prototype.transform = function (e, t, r, n, i, o) {
              this.permute(o, e, t, r, n, i);
              for (var a = 1; a < i; a <<= 1)
                for (
                  var s = a << 1,
                    u = Math.cos((2 * Math.PI) / s),
                    c = Math.sin((2 * Math.PI) / s),
                    f = 0;
                  f < i;
                  f += s
                )
                  for (var l = u, d = c, h = 0; h < a; h++) {
                    var p = r[f + h],
                      m = n[f + h],
                      b = r[f + h + a],
                      g = n[f + h + a],
                      v = l * b - d * g;
                    (g = l * g + d * b),
                      (b = v),
                      (r[f + h] = p + b),
                      (n[f + h] = m + g),
                      (r[f + h + a] = p - b),
                      (n[f + h + a] = m - g),
                      h !== s &&
                        ((v = u * l - c * d), (d = u * d + c * l), (l = v));
                  }
            }),
            (m.prototype.guessLen13b = function (e, t) {
              var r = 1 | Math.max(t, e),
                n = 1 & r,
                i = 0;
              for (r = (r / 2) | 0; r; r >>>= 1) i++;
              return 1 << (i + 1 + n);
            }),
            (m.prototype.conjugate = function (e, t, r) {
              if (!(r <= 1))
                for (var n = 0; n < r / 2; n++) {
                  var i = e[n];
                  (e[n] = e[r - n - 1]),
                    (e[r - n - 1] = i),
                    (i = t[n]),
                    (t[n] = -t[r - n - 1]),
                    (t[r - n - 1] = -i);
                }
            }),
            (m.prototype.normalize13b = function (e, t) {
              for (var r = 0, n = 0; n < t / 2; n++) {
                var i =
                  8192 * Math.round(e[2 * n + 1] / t) +
                  Math.round(e[2 * n] / t) +
                  r;
                (e[n] = 67108863 & i),
                  (r = i < 67108864 ? 0 : (i / 67108864) | 0);
              }
              return e;
            }),
            (m.prototype.convert13b = function (e, t, r, i) {
              for (var o = 0, a = 0; a < t; a++)
                (o += 0 | e[a]),
                  (r[2 * a] = 8191 & o),
                  (o >>>= 13),
                  (r[2 * a + 1] = 8191 & o),
                  (o >>>= 13);
              for (a = 2 * t; a < i; ++a) r[a] = 0;
              n(0 === o), n(0 == (-8192 & o));
            }),
            (m.prototype.stub = function (e) {
              for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
              return t;
            }),
            (m.prototype.mulp = function (e, t, r) {
              var n = 2 * this.guessLen13b(e.length, t.length),
                i = this.makeRBT(n),
                o = this.stub(n),
                a = new Array(n),
                s = new Array(n),
                u = new Array(n),
                c = new Array(n),
                f = new Array(n),
                l = new Array(n),
                d = r.words;
              (d.length = n),
                this.convert13b(e.words, e.length, a, n),
                this.convert13b(t.words, t.length, c, n),
                this.transform(a, o, s, u, n, i),
                this.transform(c, o, f, l, n, i);
              for (var h = 0; h < n; h++) {
                var p = s[h] * f[h] - u[h] * l[h];
                (u[h] = s[h] * l[h] + u[h] * f[h]), (s[h] = p);
              }
              return (
                this.conjugate(s, u, n),
                this.transform(s, u, d, o, n, i),
                this.conjugate(d, o, n),
                this.normalize13b(d, n),
                (r.negative = e.negative ^ t.negative),
                (r.length = e.length + t.length),
                r.strip()
              );
            }),
            (o.prototype.mul = function (e) {
              var t = new o(null);
              return (
                (t.words = new Array(this.length + e.length)), this.mulTo(e, t)
              );
            }),
            (o.prototype.mulf = function (e) {
              var t = new o(null);
              return (
                (t.words = new Array(this.length + e.length)), p(this, e, t)
              );
            }),
            (o.prototype.imul = function (e) {
              return this.clone().mulTo(e, this);
            }),
            (o.prototype.imuln = function (e) {
              n('number' == typeof e), n(e < 67108864);
              for (var t = 0, r = 0; r < this.length; r++) {
                var i = (0 | this.words[r]) * e,
                  o = (67108863 & i) + (67108863 & t);
                (t >>= 26),
                  (t += (i / 67108864) | 0),
                  (t += o >>> 26),
                  (this.words[r] = 67108863 & o);
              }
              return 0 !== t && ((this.words[r] = t), this.length++), this;
            }),
            (o.prototype.muln = function (e) {
              return this.clone().imuln(e);
            }),
            (o.prototype.sqr = function () {
              return this.mul(this);
            }),
            (o.prototype.isqr = function () {
              return this.imul(this.clone());
            }),
            (o.prototype.pow = function (e) {
              var t = (function (e) {
                for (
                  var t = new Array(e.bitLength()), r = 0;
                  r < t.length;
                  r++
                ) {
                  var n = (r / 26) | 0,
                    i = r % 26;
                  t[r] = (e.words[n] & (1 << i)) >>> i;
                }
                return t;
              })(e);
              if (0 === t.length) return new o(1);
              for (
                var r = this, n = 0;
                n < t.length && 0 === t[n];
                n++, r = r.sqr()
              );
              if (++n < t.length)
                for (var i = r.sqr(); n < t.length; n++, i = i.sqr())
                  0 !== t[n] && (r = r.mul(i));
              return r;
            }),
            (o.prototype.iushln = function (e) {
              n('number' == typeof e && e >= 0);
              var t,
                r = e % 26,
                i = (e - r) / 26,
                o = (67108863 >>> (26 - r)) << (26 - r);
              if (0 !== r) {
                var a = 0;
                for (t = 0; t < this.length; t++) {
                  var s = this.words[t] & o,
                    u = ((0 | this.words[t]) - s) << r;
                  (this.words[t] = u | a), (a = s >>> (26 - r));
                }
                a && ((this.words[t] = a), this.length++);
              }
              if (0 !== i) {
                for (t = this.length - 1; t >= 0; t--)
                  this.words[t + i] = this.words[t];
                for (t = 0; t < i; t++) this.words[t] = 0;
                this.length += i;
              }
              return this.strip();
            }),
            (o.prototype.ishln = function (e) {
              return n(0 === this.negative), this.iushln(e);
            }),
            (o.prototype.iushrn = function (e, t, r) {
              var i;
              n('number' == typeof e && e >= 0),
                (i = t ? (t - (t % 26)) / 26 : 0);
              var o = e % 26,
                a = Math.min((e - o) / 26, this.length),
                s = 67108863 ^ ((67108863 >>> o) << o),
                u = r;
              if (((i -= a), (i = Math.max(0, i)), u)) {
                for (var c = 0; c < a; c++) u.words[c] = this.words[c];
                u.length = a;
              }
              if (0 === a);
              else if (this.length > a)
                for (this.length -= a, c = 0; c < this.length; c++)
                  this.words[c] = this.words[c + a];
              else (this.words[0] = 0), (this.length = 1);
              var f = 0;
              for (c = this.length - 1; c >= 0 && (0 !== f || c >= i); c--) {
                var l = 0 | this.words[c];
                (this.words[c] = (f << (26 - o)) | (l >>> o)), (f = l & s);
              }
              return (
                u && 0 !== f && (u.words[u.length++] = f),
                0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                this.strip()
              );
            }),
            (o.prototype.ishrn = function (e, t, r) {
              return n(0 === this.negative), this.iushrn(e, t, r);
            }),
            (o.prototype.shln = function (e) {
              return this.clone().ishln(e);
            }),
            (o.prototype.ushln = function (e) {
              return this.clone().iushln(e);
            }),
            (o.prototype.shrn = function (e) {
              return this.clone().ishrn(e);
            }),
            (o.prototype.ushrn = function (e) {
              return this.clone().iushrn(e);
            }),
            (o.prototype.testn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t;
              return !(this.length <= r) && !!(this.words[r] & i);
            }),
            (o.prototype.imaskn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = e % 26,
                r = (e - t) / 26;
              if (
                (n(
                  0 === this.negative,
                  'imaskn works only with positive numbers'
                ),
                this.length <= r)
              )
                return this;
              if (
                (0 !== t && r++,
                (this.length = Math.min(r, this.length)),
                0 !== t)
              ) {
                var i = 67108863 ^ ((67108863 >>> t) << t);
                this.words[this.length - 1] &= i;
              }
              return this.strip();
            }),
            (o.prototype.maskn = function (e) {
              return this.clone().imaskn(e);
            }),
            (o.prototype.iaddn = function (e) {
              return (
                n('number' == typeof e),
                n(e < 67108864),
                e < 0
                  ? this.isubn(-e)
                  : 0 !== this.negative
                  ? 1 === this.length && (0 | this.words[0]) < e
                    ? ((this.words[0] = e - (0 | this.words[0])),
                      (this.negative = 0),
                      this)
                    : ((this.negative = 0),
                      this.isubn(e),
                      (this.negative = 1),
                      this)
                  : this._iaddn(e)
              );
            }),
            (o.prototype._iaddn = function (e) {
              this.words[0] += e;
              for (var t = 0; t < this.length && this.words[t] >= 67108864; t++)
                (this.words[t] -= 67108864),
                  t === this.length - 1
                    ? (this.words[t + 1] = 1)
                    : this.words[t + 1]++;
              return (this.length = Math.max(this.length, t + 1)), this;
            }),
            (o.prototype.isubn = function (e) {
              if ((n('number' == typeof e), n(e < 67108864), e < 0))
                return this.iaddn(-e);
              if (0 !== this.negative)
                return (
                  (this.negative = 0), this.iaddn(e), (this.negative = 1), this
                );
              if (
                ((this.words[0] -= e), 1 === this.length && this.words[0] < 0)
              )
                (this.words[0] = -this.words[0]), (this.negative = 1);
              else
                for (var t = 0; t < this.length && this.words[t] < 0; t++)
                  (this.words[t] += 67108864), (this.words[t + 1] -= 1);
              return this.strip();
            }),
            (o.prototype.addn = function (e) {
              return this.clone().iaddn(e);
            }),
            (o.prototype.subn = function (e) {
              return this.clone().isubn(e);
            }),
            (o.prototype.iabs = function () {
              return (this.negative = 0), this;
            }),
            (o.prototype.abs = function () {
              return this.clone().iabs();
            }),
            (o.prototype._ishlnsubmul = function (e, t, r) {
              var i,
                o,
                a = e.length + r;
              this._expand(a);
              var s = 0;
              for (i = 0; i < e.length; i++) {
                o = (0 | this.words[i + r]) + s;
                var u = (0 | e.words[i]) * t;
                (s = ((o -= 67108863 & u) >> 26) - ((u / 67108864) | 0)),
                  (this.words[i + r] = 67108863 & o);
              }
              for (; i < this.length - r; i++)
                (s = (o = (0 | this.words[i + r]) + s) >> 26),
                  (this.words[i + r] = 67108863 & o);
              if (0 === s) return this.strip();
              for (n(-1 === s), s = 0, i = 0; i < this.length; i++)
                (s = (o = -(0 | this.words[i]) + s) >> 26),
                  (this.words[i] = 67108863 & o);
              return (this.negative = 1), this.strip();
            }),
            (o.prototype._wordDiv = function (e, t) {
              var r = (this.length, e.length),
                n = this.clone(),
                i = e,
                a = 0 | i.words[i.length - 1];
              0 !== (r = 26 - this._countBits(a)) &&
                ((i = i.ushln(r)),
                n.iushln(r),
                (a = 0 | i.words[i.length - 1]));
              var s,
                u = n.length - i.length;
              if ('mod' !== t) {
                ((s = new o(null)).length = u + 1),
                  (s.words = new Array(s.length));
                for (var c = 0; c < s.length; c++) s.words[c] = 0;
              }
              var f = n.clone()._ishlnsubmul(i, 1, u);
              0 === f.negative && ((n = f), s && (s.words[u] = 1));
              for (var l = u - 1; l >= 0; l--) {
                var d =
                  67108864 * (0 | n.words[i.length + l]) +
                  (0 | n.words[i.length + l - 1]);
                for (
                  d = Math.min((d / a) | 0, 67108863), n._ishlnsubmul(i, d, l);
                  0 !== n.negative;

                )
                  d--,
                    (n.negative = 0),
                    n._ishlnsubmul(i, 1, l),
                    n.isZero() || (n.negative ^= 1);
                s && (s.words[l] = d);
              }
              return (
                s && s.strip(),
                n.strip(),
                'div' !== t && 0 !== r && n.iushrn(r),
                { div: s || null, mod: n }
              );
            }),
            (o.prototype.divmod = function (e, t, r) {
              return (
                n(!e.isZero()),
                this.isZero()
                  ? { div: new o(0), mod: new o(0) }
                  : 0 !== this.negative && 0 === e.negative
                  ? ((s = this.neg().divmod(e, t)),
                    'mod' !== t && (i = s.div.neg()),
                    'div' !== t &&
                      ((a = s.mod.neg()), r && 0 !== a.negative && a.iadd(e)),
                    { div: i, mod: a })
                  : 0 === this.negative && 0 !== e.negative
                  ? ((s = this.divmod(e.neg(), t)),
                    'mod' !== t && (i = s.div.neg()),
                    { div: i, mod: s.mod })
                  : 0 != (this.negative & e.negative)
                  ? ((s = this.neg().divmod(e.neg(), t)),
                    'div' !== t &&
                      ((a = s.mod.neg()), r && 0 !== a.negative && a.isub(e)),
                    { div: s.div, mod: a })
                  : e.length > this.length || this.cmp(e) < 0
                  ? { div: new o(0), mod: this }
                  : 1 === e.length
                  ? 'div' === t
                    ? { div: this.divn(e.words[0]), mod: null }
                    : 'mod' === t
                    ? { div: null, mod: new o(this.modn(e.words[0])) }
                    : {
                        div: this.divn(e.words[0]),
                        mod: new o(this.modn(e.words[0])),
                      }
                  : this._wordDiv(e, t)
              );
              var i, a, s;
            }),
            (o.prototype.div = function (e) {
              return this.divmod(e, 'div', !1).div;
            }),
            (o.prototype.mod = function (e) {
              return this.divmod(e, 'mod', !1).mod;
            }),
            (o.prototype.umod = function (e) {
              return this.divmod(e, 'mod', !0).mod;
            }),
            (o.prototype.divRound = function (e) {
              var t = this.divmod(e);
              if (t.mod.isZero()) return t.div;
              var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,
                n = e.ushrn(1),
                i = e.andln(1),
                o = r.cmp(n);
              return o < 0 || (1 === i && 0 === o)
                ? t.div
                : 0 !== t.div.negative
                ? t.div.isubn(1)
                : t.div.iaddn(1);
            }),
            (o.prototype.modn = function (e) {
              n(e <= 67108863);
              for (
                var t = (1 << 26) % e, r = 0, i = this.length - 1;
                i >= 0;
                i--
              )
                r = (t * r + (0 | this.words[i])) % e;
              return r;
            }),
            (o.prototype.idivn = function (e) {
              n(e <= 67108863);
              for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var i = (0 | this.words[r]) + 67108864 * t;
                (this.words[r] = (i / e) | 0), (t = i % e);
              }
              return this.strip();
            }),
            (o.prototype.divn = function (e) {
              return this.clone().idivn(e);
            }),
            (o.prototype.egcd = function (e) {
              n(0 === e.negative), n(!e.isZero());
              var t = this,
                r = e.clone();
              t = 0 !== t.negative ? t.umod(e) : t.clone();
              for (
                var i = new o(1),
                  a = new o(0),
                  s = new o(0),
                  u = new o(1),
                  c = 0;
                t.isEven() && r.isEven();

              )
                t.iushrn(1), r.iushrn(1), ++c;
              for (var f = r.clone(), l = t.clone(); !t.isZero(); ) {
                for (
                  var d = 0, h = 1;
                  0 == (t.words[0] & h) && d < 26;
                  ++d, h <<= 1
                );
                if (d > 0)
                  for (t.iushrn(d); d-- > 0; )
                    (i.isOdd() || a.isOdd()) && (i.iadd(f), a.isub(l)),
                      i.iushrn(1),
                      a.iushrn(1);
                for (
                  var p = 0, m = 1;
                  0 == (r.words[0] & m) && p < 26;
                  ++p, m <<= 1
                );
                if (p > 0)
                  for (r.iushrn(p); p-- > 0; )
                    (s.isOdd() || u.isOdd()) && (s.iadd(f), u.isub(l)),
                      s.iushrn(1),
                      u.iushrn(1);
                t.cmp(r) >= 0
                  ? (t.isub(r), i.isub(s), a.isub(u))
                  : (r.isub(t), s.isub(i), u.isub(a));
              }
              return { a: s, b: u, gcd: r.iushln(c) };
            }),
            (o.prototype._invmp = function (e) {
              n(0 === e.negative), n(!e.isZero());
              var t = this,
                r = e.clone();
              t = 0 !== t.negative ? t.umod(e) : t.clone();
              for (
                var i, a = new o(1), s = new o(0), u = r.clone();
                t.cmpn(1) > 0 && r.cmpn(1) > 0;

              ) {
                for (
                  var c = 0, f = 1;
                  0 == (t.words[0] & f) && c < 26;
                  ++c, f <<= 1
                );
                if (c > 0)
                  for (t.iushrn(c); c-- > 0; )
                    a.isOdd() && a.iadd(u), a.iushrn(1);
                for (
                  var l = 0, d = 1;
                  0 == (r.words[0] & d) && l < 26;
                  ++l, d <<= 1
                );
                if (l > 0)
                  for (r.iushrn(l); l-- > 0; )
                    s.isOdd() && s.iadd(u), s.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), a.isub(s)) : (r.isub(t), s.isub(a));
              }
              return (i = 0 === t.cmpn(1) ? a : s).cmpn(0) < 0 && i.iadd(e), i;
            }),
            (o.prototype.gcd = function (e) {
              if (this.isZero()) return e.abs();
              if (e.isZero()) return this.abs();
              var t = this.clone(),
                r = e.clone();
              (t.negative = 0), (r.negative = 0);
              for (var n = 0; t.isEven() && r.isEven(); n++)
                t.iushrn(1), r.iushrn(1);
              for (;;) {
                for (; t.isEven(); ) t.iushrn(1);
                for (; r.isEven(); ) r.iushrn(1);
                var i = t.cmp(r);
                if (i < 0) {
                  var o = t;
                  (t = r), (r = o);
                } else if (0 === i || 0 === r.cmpn(1)) break;
                t.isub(r);
              }
              return r.iushln(n);
            }),
            (o.prototype.invm = function (e) {
              return this.egcd(e).a.umod(e);
            }),
            (o.prototype.isEven = function () {
              return 0 == (1 & this.words[0]);
            }),
            (o.prototype.isOdd = function () {
              return 1 == (1 & this.words[0]);
            }),
            (o.prototype.andln = function (e) {
              return this.words[0] & e;
            }),
            (o.prototype.bincn = function (e) {
              n('number' == typeof e);
              var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t;
              if (this.length <= r)
                return this._expand(r + 1), (this.words[r] |= i), this;
              for (var o = i, a = r; 0 !== o && a < this.length; a++) {
                var s = 0 | this.words[a];
                (o = (s += o) >>> 26), (s &= 67108863), (this.words[a] = s);
              }
              return 0 !== o && ((this.words[a] = o), this.length++), this;
            }),
            (o.prototype.isZero = function () {
              return 1 === this.length && 0 === this.words[0];
            }),
            (o.prototype.cmpn = function (e) {
              var t,
                r = e < 0;
              if (0 !== this.negative && !r) return -1;
              if (0 === this.negative && r) return 1;
              if ((this.strip(), this.length > 1)) t = 1;
              else {
                r && (e = -e), n(e <= 67108863, 'Number is too big');
                var i = 0 | this.words[0];
                t = i === e ? 0 : i < e ? -1 : 1;
              }
              return 0 !== this.negative ? 0 | -t : t;
            }),
            (o.prototype.cmp = function (e) {
              if (0 !== this.negative && 0 === e.negative) return -1;
              if (0 === this.negative && 0 !== e.negative) return 1;
              var t = this.ucmp(e);
              return 0 !== this.negative ? 0 | -t : t;
            }),
            (o.prototype.ucmp = function (e) {
              if (this.length > e.length) return 1;
              if (this.length < e.length) return -1;
              for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var n = 0 | this.words[r],
                  i = 0 | e.words[r];
                if (n !== i) {
                  n < i ? (t = -1) : n > i && (t = 1);
                  break;
                }
              }
              return t;
            }),
            (o.prototype.gtn = function (e) {
              return 1 === this.cmpn(e);
            }),
            (o.prototype.gt = function (e) {
              return 1 === this.cmp(e);
            }),
            (o.prototype.gten = function (e) {
              return this.cmpn(e) >= 0;
            }),
            (o.prototype.gte = function (e) {
              return this.cmp(e) >= 0;
            }),
            (o.prototype.ltn = function (e) {
              return -1 === this.cmpn(e);
            }),
            (o.prototype.lt = function (e) {
              return -1 === this.cmp(e);
            }),
            (o.prototype.lten = function (e) {
              return this.cmpn(e) <= 0;
            }),
            (o.prototype.lte = function (e) {
              return this.cmp(e) <= 0;
            }),
            (o.prototype.eqn = function (e) {
              return 0 === this.cmpn(e);
            }),
            (o.prototype.eq = function (e) {
              return 0 === this.cmp(e);
            }),
            (o.red = function (e) {
              return new S(e);
            }),
            (o.prototype.toRed = function (e) {
              return (
                n(!this.red, 'Already a number in reduction context'),
                n(0 === this.negative, 'red works only with positives'),
                e.convertTo(this)._forceRed(e)
              );
            }),
            (o.prototype.fromRed = function () {
              return (
                n(
                  this.red,
                  'fromRed works only with numbers in reduction context'
                ),
                this.red.convertFrom(this)
              );
            }),
            (o.prototype._forceRed = function (e) {
              return (this.red = e), this;
            }),
            (o.prototype.forceRed = function (e) {
              return (
                n(!this.red, 'Already a number in reduction context'),
                this._forceRed(e)
              );
            }),
            (o.prototype.redAdd = function (e) {
              return (
                n(this.red, 'redAdd works only with red numbers'),
                this.red.add(this, e)
              );
            }),
            (o.prototype.redIAdd = function (e) {
              return (
                n(this.red, 'redIAdd works only with red numbers'),
                this.red.iadd(this, e)
              );
            }),
            (o.prototype.redSub = function (e) {
              return (
                n(this.red, 'redSub works only with red numbers'),
                this.red.sub(this, e)
              );
            }),
            (o.prototype.redISub = function (e) {
              return (
                n(this.red, 'redISub works only with red numbers'),
                this.red.isub(this, e)
              );
            }),
            (o.prototype.redShl = function (e) {
              return (
                n(this.red, 'redShl works only with red numbers'),
                this.red.shl(this, e)
              );
            }),
            (o.prototype.redMul = function (e) {
              return (
                n(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, e),
                this.red.mul(this, e)
              );
            }),
            (o.prototype.redIMul = function (e) {
              return (
                n(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, e),
                this.red.imul(this, e)
              );
            }),
            (o.prototype.redSqr = function () {
              return (
                n(this.red, 'redSqr works only with red numbers'),
                this.red._verify1(this),
                this.red.sqr(this)
              );
            }),
            (o.prototype.redISqr = function () {
              return (
                n(this.red, 'redISqr works only with red numbers'),
                this.red._verify1(this),
                this.red.isqr(this)
              );
            }),
            (o.prototype.redSqrt = function () {
              return (
                n(this.red, 'redSqrt works only with red numbers'),
                this.red._verify1(this),
                this.red.sqrt(this)
              );
            }),
            (o.prototype.redInvm = function () {
              return (
                n(this.red, 'redInvm works only with red numbers'),
                this.red._verify1(this),
                this.red.invm(this)
              );
            }),
            (o.prototype.redNeg = function () {
              return (
                n(this.red, 'redNeg works only with red numbers'),
                this.red._verify1(this),
                this.red.neg(this)
              );
            }),
            (o.prototype.redPow = function (e) {
              return (
                n(this.red && !e.red, 'redPow(normalNum)'),
                this.red._verify1(this),
                this.red.pow(this, e)
              );
            });
          var b = { k256: null, p224: null, p192: null, p25519: null };
          function g(e, t) {
            (this.name = e),
              (this.p = new o(t, 16)),
              (this.n = this.p.bitLength()),
              (this.k = new o(1).iushln(this.n).isub(this.p)),
              (this.tmp = this._tmp());
          }
          function v() {
            g.call(
              this,
              'k256',
              'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
            );
          }
          function y() {
            g.call(
              this,
              'p224',
              'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001'
            );
          }
          function w() {
            g.call(
              this,
              'p192',
              'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff'
            );
          }
          function _() {
            g.call(
              this,
              '25519',
              '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed'
            );
          }
          function S(e) {
            if ('string' == typeof e) {
              var t = o._prime(e);
              (this.m = t.p), (this.prime = t);
            } else
              n(e.gtn(1), 'modulus must be greater than 1'),
                (this.m = e),
                (this.prime = null);
          }
          function M(e) {
            S.call(this, e),
              (this.shift = this.m.bitLength()),
              this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
              (this.r = new o(1).iushln(this.shift)),
              (this.r2 = this.imod(this.r.sqr())),
              (this.rinv = this.r._invmp(this.m)),
              (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
              (this.minv = this.minv.umod(this.r)),
              (this.minv = this.r.sub(this.minv));
          }
          (g.prototype._tmp = function () {
            var e = new o(null);
            return (e.words = new Array(Math.ceil(this.n / 13))), e;
          }),
            (g.prototype.ireduce = function (e) {
              var t,
                r = e;
              do {
                this.split(r, this.tmp),
                  (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength());
              } while (t > this.n);
              var n = t < this.n ? -1 : r.ucmp(this.p);
              return (
                0 === n
                  ? ((r.words[0] = 0), (r.length = 1))
                  : n > 0
                  ? r.isub(this.p)
                  : void 0 !== r.strip
                  ? r.strip()
                  : r._strip(),
                r
              );
            }),
            (g.prototype.split = function (e, t) {
              e.iushrn(this.n, 0, t);
            }),
            (g.prototype.imulK = function (e) {
              return e.imul(this.k);
            }),
            i(v, g),
            (v.prototype.split = function (e, t) {
              for (var r = Math.min(e.length, 9), n = 0; n < r; n++)
                t.words[n] = e.words[n];
              if (((t.length = r), e.length <= 9))
                return (e.words[0] = 0), void (e.length = 1);
              var i = e.words[9];
              for (
                t.words[t.length++] = 4194303 & i, n = 10;
                n < e.length;
                n++
              ) {
                var o = 0 | e.words[n];
                (e.words[n - 10] = ((4194303 & o) << 4) | (i >>> 22)), (i = o);
              }
              (i >>>= 22),
                (e.words[n - 10] = i),
                0 === i && e.length > 10 ? (e.length -= 10) : (e.length -= 9);
            }),
            (v.prototype.imulK = function (e) {
              (e.words[e.length] = 0),
                (e.words[e.length + 1] = 0),
                (e.length += 2);
              for (var t = 0, r = 0; r < e.length; r++) {
                var n = 0 | e.words[r];
                (t += 977 * n),
                  (e.words[r] = 67108863 & t),
                  (t = 64 * n + ((t / 67108864) | 0));
              }
              return (
                0 === e.words[e.length - 1] &&
                  (e.length--, 0 === e.words[e.length - 1] && e.length--),
                e
              );
            }),
            i(y, g),
            i(w, g),
            i(_, g),
            (_.prototype.imulK = function (e) {
              for (var t = 0, r = 0; r < e.length; r++) {
                var n = 19 * (0 | e.words[r]) + t,
                  i = 67108863 & n;
                (n >>>= 26), (e.words[r] = i), (t = n);
              }
              return 0 !== t && (e.words[e.length++] = t), e;
            }),
            (o._prime = function (e) {
              if (b[e]) return b[e];
              var t;
              if ('k256' === e) t = new v();
              else if ('p224' === e) t = new y();
              else if ('p192' === e) t = new w();
              else {
                if ('p25519' !== e) throw new Error('Unknown prime ' + e);
                t = new _();
              }
              return (b[e] = t), t;
            }),
            (S.prototype._verify1 = function (e) {
              n(0 === e.negative, 'red works only with positives'),
                n(e.red, 'red works only with red numbers');
            }),
            (S.prototype._verify2 = function (e, t) {
              n(
                0 == (e.negative | t.negative),
                'red works only with positives'
              ),
                n(e.red && e.red === t.red, 'red works only with red numbers');
            }),
            (S.prototype.imod = function (e) {
              return this.prime
                ? this.prime.ireduce(e)._forceRed(this)
                : e.umod(this.m)._forceRed(this);
            }),
            (S.prototype.neg = function (e) {
              return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
            }),
            (S.prototype.add = function (e, t) {
              this._verify2(e, t);
              var r = e.add(t);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
            }),
            (S.prototype.iadd = function (e, t) {
              this._verify2(e, t);
              var r = e.iadd(t);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r;
            }),
            (S.prototype.sub = function (e, t) {
              this._verify2(e, t);
              var r = e.sub(t);
              return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
            }),
            (S.prototype.isub = function (e, t) {
              this._verify2(e, t);
              var r = e.isub(t);
              return r.cmpn(0) < 0 && r.iadd(this.m), r;
            }),
            (S.prototype.shl = function (e, t) {
              return this._verify1(e), this.imod(e.ushln(t));
            }),
            (S.prototype.imul = function (e, t) {
              return this._verify2(e, t), this.imod(e.imul(t));
            }),
            (S.prototype.mul = function (e, t) {
              return this._verify2(e, t), this.imod(e.mul(t));
            }),
            (S.prototype.isqr = function (e) {
              return this.imul(e, e.clone());
            }),
            (S.prototype.sqr = function (e) {
              return this.mul(e, e);
            }),
            (S.prototype.sqrt = function (e) {
              if (e.isZero()) return e.clone();
              var t = this.m.andln(3);
              if ((n(t % 2 == 1), 3 === t)) {
                var r = this.m.add(new o(1)).iushrn(2);
                return this.pow(e, r);
              }
              for (
                var i = this.m.subn(1), a = 0;
                !i.isZero() && 0 === i.andln(1);

              )
                a++, i.iushrn(1);
              n(!i.isZero());
              var s = new o(1).toRed(this),
                u = s.redNeg(),
                c = this.m.subn(1).iushrn(1),
                f = this.m.bitLength();
              for (
                f = new o(2 * f * f).toRed(this);
                0 !== this.pow(f, c).cmp(u);

              )
                f.redIAdd(u);
              for (
                var l = this.pow(f, i),
                  d = this.pow(e, i.addn(1).iushrn(1)),
                  h = this.pow(e, i),
                  p = a;
                0 !== h.cmp(s);

              ) {
                for (var m = h, b = 0; 0 !== m.cmp(s); b++) m = m.redSqr();
                n(b < p);
                var g = this.pow(l, new o(1).iushln(p - b - 1));
                (d = d.redMul(g)), (l = g.redSqr()), (h = h.redMul(l)), (p = b);
              }
              return d;
            }),
            (S.prototype.invm = function (e) {
              var t = e._invmp(this.m);
              return 0 !== t.negative
                ? ((t.negative = 0), this.imod(t).redNeg())
                : this.imod(t);
            }),
            (S.prototype.pow = function (e, t) {
              if (t.isZero()) return new o(1).toRed(this);
              if (0 === t.cmpn(1)) return e.clone();
              var r = new Array(16);
              (r[0] = new o(1).toRed(this)), (r[1] = e);
              for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], e);
              var i = r[0],
                a = 0,
                s = 0,
                u = t.bitLength() % 26;
              for (0 === u && (u = 26), n = t.length - 1; n >= 0; n--) {
                for (var c = t.words[n], f = u - 1; f >= 0; f--) {
                  var l = (c >> f) & 1;
                  i !== r[0] && (i = this.sqr(i)),
                    0 !== l || 0 !== a
                      ? ((a <<= 1),
                        (a |= l),
                        (4 === ++s || (0 === n && 0 === f)) &&
                          ((i = this.mul(i, r[a])), (s = 0), (a = 0)))
                      : (s = 0);
                }
                u = 26;
              }
              return i;
            }),
            (S.prototype.convertTo = function (e) {
              var t = e.umod(this.m);
              return t === e ? t.clone() : t;
            }),
            (S.prototype.convertFrom = function (e) {
              var t = e.clone();
              return (t.red = null), t;
            }),
            (o.mont = function (e) {
              return new M(e);
            }),
            i(M, S),
            (M.prototype.convertTo = function (e) {
              return this.imod(e.ushln(this.shift));
            }),
            (M.prototype.convertFrom = function (e) {
              var t = this.imod(e.mul(this.rinv));
              return (t.red = null), t;
            }),
            (M.prototype.imul = function (e, t) {
              if (e.isZero() || t.isZero())
                return (e.words[0] = 0), (e.length = 1), e;
              var r = e.imul(t),
                n = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                i = r.isub(n).iushrn(this.shift),
                o = i;
              return (
                i.cmp(this.m) >= 0
                  ? (o = i.isub(this.m))
                  : i.cmpn(0) < 0 && (o = i.iadd(this.m)),
                o._forceRed(this)
              );
            }),
            (M.prototype.mul = function (e, t) {
              if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
              var r = e.mul(t),
                n = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                i = r.isub(n).iushrn(this.shift),
                a = i;
              return (
                i.cmp(this.m) >= 0
                  ? (a = i.isub(this.m))
                  : i.cmpn(0) < 0 && (a = i.iadd(this.m)),
                a._forceRed(this)
              );
            }),
            (M.prototype.invm = function (e) {
              return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
            });
        })(e, this);
      }.call(this, r(42)(e)));
    },
    function (e, t, r) {
      'use strict';
      var n = r(24),
        i = r(25);
      function o(e, t) {
        return (
          55296 == (64512 & e.charCodeAt(t)) &&
          !(t < 0 || t + 1 >= e.length) &&
          56320 == (64512 & e.charCodeAt(t + 1))
        );
      }
      function a(e) {
        return (
          ((e >>> 24) |
            ((e >>> 8) & 65280) |
            ((e << 8) & 16711680) |
            ((255 & e) << 24)) >>>
          0
        );
      }
      function s(e) {
        return 1 === e.length ? '0' + e : e;
      }
      function u(e) {
        return 7 === e.length
          ? '0' + e
          : 6 === e.length
          ? '00' + e
          : 5 === e.length
          ? '000' + e
          : 4 === e.length
          ? '0000' + e
          : 3 === e.length
          ? '00000' + e
          : 2 === e.length
          ? '000000' + e
          : 1 === e.length
          ? '0000000' + e
          : e;
      }
      (t.inherits = i),
        (t.toArray = function (e, t) {
          if (Array.isArray(e)) return e.slice();
          if (!e) return [];
          var r = [];
          if ('string' == typeof e)
            if (t) {
              if ('hex' === t)
                for (
                  (e = e.replace(/[^a-z0-9]+/gi, '')).length % 2 != 0 &&
                    (e = '0' + e),
                    i = 0;
                  i < e.length;
                  i += 2
                )
                  r.push(parseInt(e[i] + e[i + 1], 16));
            } else
              for (var n = 0, i = 0; i < e.length; i++) {
                var a = e.charCodeAt(i);
                a < 128
                  ? (r[n++] = a)
                  : a < 2048
                  ? ((r[n++] = (a >> 6) | 192), (r[n++] = (63 & a) | 128))
                  : o(e, i)
                  ? ((a =
                      65536 + ((1023 & a) << 10) + (1023 & e.charCodeAt(++i))),
                    (r[n++] = (a >> 18) | 240),
                    (r[n++] = ((a >> 12) & 63) | 128),
                    (r[n++] = ((a >> 6) & 63) | 128),
                    (r[n++] = (63 & a) | 128))
                  : ((r[n++] = (a >> 12) | 224),
                    (r[n++] = ((a >> 6) & 63) | 128),
                    (r[n++] = (63 & a) | 128));
              }
          else for (i = 0; i < e.length; i++) r[i] = 0 | e[i];
          return r;
        }),
        (t.toHex = function (e) {
          for (var t = '', r = 0; r < e.length; r++) t += s(e[r].toString(16));
          return t;
        }),
        (t.htonl = a),
        (t.toHex32 = function (e, t) {
          for (var r = '', n = 0; n < e.length; n++) {
            var i = e[n];
            'little' === t && (i = a(i)), (r += u(i.toString(16)));
          }
          return r;
        }),
        (t.zero2 = s),
        (t.zero8 = u),
        (t.join32 = function (e, t, r, i) {
          var o = r - t;
          n(o % 4 == 0);
          for (
            var a = new Array(o / 4), s = 0, u = t;
            s < a.length;
            s++, u += 4
          ) {
            var c;
            (c =
              'big' === i
                ? (e[u] << 24) | (e[u + 1] << 16) | (e[u + 2] << 8) | e[u + 3]
                : (e[u + 3] << 24) | (e[u + 2] << 16) | (e[u + 1] << 8) | e[u]),
              (a[s] = c >>> 0);
          }
          return a;
        }),
        (t.split32 = function (e, t) {
          for (
            var r = new Array(4 * e.length), n = 0, i = 0;
            n < e.length;
            n++, i += 4
          ) {
            var o = e[n];
            'big' === t
              ? ((r[i] = o >>> 24),
                (r[i + 1] = (o >>> 16) & 255),
                (r[i + 2] = (o >>> 8) & 255),
                (r[i + 3] = 255 & o))
              : ((r[i + 3] = o >>> 24),
                (r[i + 2] = (o >>> 16) & 255),
                (r[i + 1] = (o >>> 8) & 255),
                (r[i] = 255 & o));
          }
          return r;
        }),
        (t.rotr32 = function (e, t) {
          return (e >>> t) | (e << (32 - t));
        }),
        (t.rotl32 = function (e, t) {
          return (e << t) | (e >>> (32 - t));
        }),
        (t.sum32 = function (e, t) {
          return (e + t) >>> 0;
        }),
        (t.sum32_3 = function (e, t, r) {
          return (e + t + r) >>> 0;
        }),
        (t.sum32_4 = function (e, t, r, n) {
          return (e + t + r + n) >>> 0;
        }),
        (t.sum32_5 = function (e, t, r, n, i) {
          return (e + t + r + n + i) >>> 0;
        }),
        (t.sum64 = function (e, t, r, n) {
          var i = e[t],
            o = (n + e[t + 1]) >>> 0,
            a = (o < n ? 1 : 0) + r + i;
          (e[t] = a >>> 0), (e[t + 1] = o);
        }),
        (t.sum64_hi = function (e, t, r, n) {
          return (((t + n) >>> 0 < t ? 1 : 0) + e + r) >>> 0;
        }),
        (t.sum64_lo = function (e, t, r, n) {
          return (t + n) >>> 0;
        }),
        (t.sum64_4_hi = function (e, t, r, n, i, o, a, s) {
          var u = 0,
            c = t;
          return (
            (u += (c = (c + n) >>> 0) < t ? 1 : 0),
            (u += (c = (c + o) >>> 0) < o ? 1 : 0),
            (e + r + i + a + (u += (c = (c + s) >>> 0) < s ? 1 : 0)) >>> 0
          );
        }),
        (t.sum64_4_lo = function (e, t, r, n, i, o, a, s) {
          return (t + n + o + s) >>> 0;
        }),
        (t.sum64_5_hi = function (e, t, r, n, i, o, a, s, u, c) {
          var f = 0,
            l = t;
          return (
            (f += (l = (l + n) >>> 0) < t ? 1 : 0),
            (f += (l = (l + o) >>> 0) < o ? 1 : 0),
            (f += (l = (l + s) >>> 0) < s ? 1 : 0),
            (e + r + i + a + u + (f += (l = (l + c) >>> 0) < c ? 1 : 0)) >>> 0
          );
        }),
        (t.sum64_5_lo = function (e, t, r, n, i, o, a, s, u, c) {
          return (t + n + o + s + c) >>> 0;
        }),
        (t.rotr64_hi = function (e, t, r) {
          return ((t << (32 - r)) | (e >>> r)) >>> 0;
        }),
        (t.rotr64_lo = function (e, t, r) {
          return ((e << (32 - r)) | (t >>> r)) >>> 0;
        }),
        (t.shr64_hi = function (e, t, r) {
          return e >>> r;
        }),
        (t.shr64_lo = function (e, t, r) {
          return ((e << (32 - r)) | (t >>> r)) >>> 0;
        });
    },
    function (e, t, r) {
      /*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
      var n = r(32),
        i = n.Buffer;
      function o(e, t) {
        for (var r in e) t[r] = e[r];
      }
      function a(e, t, r) {
        return i(e, t, r);
      }
      i.from && i.alloc && i.allocUnsafe && i.allocUnsafeSlow
        ? (e.exports = n)
        : (o(n, t), (t.Buffer = a)),
        (a.prototype = Object.create(i.prototype)),
        o(i, a),
        (a.from = function (e, t, r) {
          if ('number' == typeof e)
            throw new TypeError('Argument must not be a number');
          return i(e, t, r);
        }),
        (a.alloc = function (e, t, r) {
          if ('number' != typeof e)
            throw new TypeError('Argument must be a number');
          var n = i(e);
          return (
            void 0 !== t
              ? 'string' == typeof r
                ? n.fill(t, r)
                : n.fill(t)
              : n.fill(0),
            n
          );
        }),
        (a.allocUnsafe = function (e) {
          if ('number' != typeof e)
            throw new TypeError('Argument must be a number');
          return i(e);
        }),
        (a.allocUnsafeSlow = function (e) {
          if ('number' != typeof e)
            throw new TypeError('Argument must be a number');
          return n.SlowBuffer(e);
        });
    },
    function (e, t) {
      e.exports = require('url');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(4),
        i = Math.pow(2, 31) - 1;
      function o(e) {
        return n.String(e) && !!e.match(/^(m\/)?(\d+'?\/)*\d+'?$/);
      }
      (t.UInt31 = function (e) {
        return n.UInt32(e) && e <= i;
      }),
        (t.BIP32Path = o),
        (o.toJSON = () => 'BIP32 derivation path'),
        (t.Signer = function (e) {
          return (
            (n.Buffer(e.publicKey) || 'function' == typeof e.getPublicKey) &&
            'function' == typeof e.sign
          );
        });
      (t.Satoshi = function (e) {
        return n.UInt53(e) && e <= 21e14;
      }),
        (t.ECPoint = n.quacksLike('Point')),
        (t.Network = n.compile({
          messagePrefix: n.oneOf(n.Buffer, n.String),
          bip32: { public: n.UInt32, private: n.UInt32 },
          pubKeyHash: n.UInt8,
          scriptHash: n.UInt8,
          wif: n.UInt8,
        })),
        (t.Buffer256bit = n.BufferN(32)),
        (t.Hash160bit = n.BufferN(20)),
        (t.Hash256bit = n.BufferN(32)),
        (t.Number = n.Number),
        (t.Array = n.Array),
        (t.Boolean = n.Boolean),
        (t.String = n.String),
        (t.Buffer = n.Buffer),
        (t.Hex = n.Hex),
        (t.maybe = n.maybe),
        (t.tuple = n.tuple),
        (t.UInt8 = n.UInt8),
        (t.UInt32 = n.UInt32),
        (t.Function = n.Function),
        (t.BufferN = n.BufferN),
        (t.Null = n.Null),
        (t.oneOf = n.oneOf);
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(46);
      function i(e) {
        try {
          return n('rmd160').update(e).digest();
        } catch (t) {
          return n('ripemd160').update(e).digest();
        }
      }
      function o(e) {
        return n('sha256').update(e).digest();
      }
      (t.ripemd160 = i),
        (t.sha1 = function (e) {
          return n('sha1').update(e).digest();
        }),
        (t.sha256 = o),
        (t.hash160 = function (e) {
          return i(o(e));
        }),
        (t.hash256 = function (e) {
          return o(o(e));
        });
    },
    function (e, t) {
      e.exports = require('assert');
    },
    ,
    function (e, t) {
      e.exports = require('stream');
    },
    ,
    function (e, t) {
      function r(e, t) {
        if (!e) throw new Error(t || 'Assertion failed');
      }
      (e.exports = r),
        (r.equal = function (e, t, r) {
          if (e != t)
            throw new Error(r || 'Assertion failed: ' + e + ' != ' + t);
        });
    },
    function (e, t, r) {
      try {
        var n = r(1);
        if ('function' != typeof n.inherits) throw '';
        e.exports = n.inherits;
      } catch (t) {
        e.exports = r(159);
      }
    },
    function (e, t) {
      e.exports = require('http');
    },
    function (e, t, r) {
      'use strict';
      try {
        e.exports = r(205);
      } catch (t) {
        e.exports = r(208);
      }
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.prop = function (e, t, r) {
          Object.defineProperty(e, t, {
            configurable: !0,
            enumerable: !0,
            get() {
              const e = r.call(this);
              return (this[t] = e), e;
            },
            set(e) {
              Object.defineProperty(this, t, {
                configurable: !0,
                enumerable: !0,
                value: e,
                writable: !0,
              });
            },
          });
        }),
        (t.value = function (e) {
          let t;
          return () => (void 0 !== t || (t = e()), t);
        });
    },
    function (e, t) {
      e.exports = require('https');
    },
    ,
    ,
    function (e, t) {
      e.exports = require('buffer');
    },
    ,
    ,
    function (e, t) {
      e.exports = require('path');
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(24);
      function o() {
        (this.pending = null),
          (this.pendingTotal = 0),
          (this.blockSize = this.constructor.blockSize),
          (this.outSize = this.constructor.outSize),
          (this.hmacStrength = this.constructor.hmacStrength),
          (this.padLength = this.constructor.padLength / 8),
          (this.endian = 'big'),
          (this._delta8 = this.blockSize / 8),
          (this._delta32 = this.blockSize / 32);
      }
      (t.BlockHash = o),
        (o.prototype.update = function (e, t) {
          if (
            ((e = n.toArray(e, t)),
            this.pending
              ? (this.pending = this.pending.concat(e))
              : (this.pending = e),
            (this.pendingTotal += e.length),
            this.pending.length >= this._delta8)
          ) {
            var r = (e = this.pending).length % this._delta8;
            (this.pending = e.slice(e.length - r, e.length)),
              0 === this.pending.length && (this.pending = null),
              (e = n.join32(e, 0, e.length - r, this.endian));
            for (var i = 0; i < e.length; i += this._delta32)
              this._update(e, i, i + this._delta32);
          }
          return this;
        }),
        (o.prototype.digest = function (e) {
          return (
            this.update(this._pad()), i(null === this.pending), this._digest(e)
          );
        }),
        (o.prototype._pad = function () {
          var e = this.pendingTotal,
            t = this._delta8,
            r = t - ((e + this.padLength) % t),
            n = new Array(r + this.padLength);
          n[0] = 128;
          for (var i = 1; i < r; i++) n[i] = 0;
          if (((e <<= 3), 'big' === this.endian)) {
            for (var o = 8; o < this.padLength; o++) n[i++] = 0;
            (n[i++] = 0),
              (n[i++] = 0),
              (n[i++] = 0),
              (n[i++] = 0),
              (n[i++] = (e >>> 24) & 255),
              (n[i++] = (e >>> 16) & 255),
              (n[i++] = (e >>> 8) & 255),
              (n[i++] = 255 & e);
          } else
            for (
              n[i++] = 255 & e,
                n[i++] = (e >>> 8) & 255,
                n[i++] = (e >>> 16) & 255,
                n[i++] = (e >>> 24) & 255,
                n[i++] = 0,
                n[i++] = 0,
                n[i++] = 0,
                n[i++] = 0,
                o = 8;
              o < this.padLength;
              o++
            )
              n[i++] = 0;
          return n;
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(46),
        i = r(202);
      e.exports = i(function (e) {
        var t = n('sha256').update(e).digest();
        return n('sha256').update(t).digest();
      });
    },
    function (e, t, r) {
      'use strict';
      function n(e, t) {
        if ('number' != typeof e)
          throw new Error('cannot write a non-number as a number');
        if (e < 0)
          throw new Error(
            'specified a negative value for writing an unsigned value'
          );
        if (e > t) throw new Error('RangeError: value out of range');
        if (Math.floor(e) !== e)
          throw new Error('value has a fractional component');
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.readUInt64LE = function (e, t) {
          const r = e.readUInt32LE(t);
          let i = e.readUInt32LE(t + 4);
          return (i *= 4294967296), n(i + r, 9007199254740991), i + r;
        }),
        (t.writeUInt64LE = function (e, t, r) {
          return (
            n(t, 9007199254740991),
            e.writeInt32LE(-1 & t, r),
            e.writeUInt32LE(Math.floor(t / 4294967296), r + 4),
            r + 8
          );
        }),
        (t.reverseBuffer = function (e) {
          if (e.length < 1) return e;
          let t = e.length - 1,
            r = 0;
          for (let n = 0; n < e.length / 2; n++)
            (r = e[n]), (e[n] = e[t]), (e[t] = r), t--;
          return e;
        });
    },
    ,
    ,
    function (e, t) {
      e.exports = require('fs');
    },
    function (e, t) {
      e.exports = function (e) {
        return (
          e.webpackPolyfill ||
            ((e.deprecate = function () {}),
            (e.paths = []),
            e.children || (e.children = []),
            Object.defineProperty(e, 'loaded', {
              enumerable: !0,
              get: function () {
                return e.l;
              },
            }),
            Object.defineProperty(e, 'id', {
              enumerable: !0,
              get: function () {
                return e.i;
              },
            }),
            (e.webpackPolyfill = 1)),
          e
        );
      };
    },
    function (e, t, r) {
      'use strict';
      var n =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, '__esModule', { value: !0 });
      const i = n(r(2)),
        o = n(r(156)),
        a = new (0, r(53).ec)('secp256k1');
      (t.BLOCK_TIME_IN_SECONDS = 5),
        (t.hash = (e, t) => i.default.createHash(e).update(t).digest()),
        (t.convertSignature = (e) => {
          let t = new o.default(e.r);
          t.cmp(a.curve.n) >= 0 && (t = new o.default(0));
          let r = new o.default(e.s);
          return (
            r.cmp(a.curve.n) >= 0 && (r = new o.default(0)),
            Buffer.concat([
              t.toArrayLike(Buffer, 'be', 32),
              r.toArrayLike(Buffer, 'be', 32),
            ])
          );
        }),
        (t.sortJson = (e) => {
          if (
            null === e ||
            ['undefined', 'string', 'number', 'boolean', 'function'].includes(
              typeof e
            )
          )
            return e;
          if (Array.isArray(e)) return e.sort().map((e) => t.sortJson(e));
          {
            let r = {};
            return (
              Object.keys(e)
                .sort()
                .forEach((n) => {
                  r[n] = t.sortJson(e[n]);
                }),
              r
            );
          }
        });
      (t.convertLease = ({
        seconds: e = 0,
        minutes: r = 0,
        hours: n = 0,
        days: i = 0,
      }) => (e + 60 * r + 3600 * n + 86400 * i) / t.BLOCK_TIME_IN_SECONDS),
        (t.encodeSafe = (e) =>
          encodeURI(e).replace(
            /([\#\?])/g,
            (e) => '%' + e.charCodeAt(0).toString(16)
          ));
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(7),
        o = i.getNAF,
        a = i.getJSF,
        s = i.assert;
      function u(e, t) {
        (this.type = e),
          (this.p = new n(t.p, 16)),
          (this.red = t.prime ? n.red(t.prime) : n.mont(this.p)),
          (this.zero = new n(0).toRed(this.red)),
          (this.one = new n(1).toRed(this.red)),
          (this.two = new n(2).toRed(this.red)),
          (this.n = t.n && new n(t.n, 16)),
          (this.g = t.g && this.pointFromJSON(t.g, t.gRed)),
          (this._wnafT1 = new Array(4)),
          (this._wnafT2 = new Array(4)),
          (this._wnafT3 = new Array(4)),
          (this._wnafT4 = new Array(4)),
          (this._bitLength = this.n ? this.n.bitLength() : 0);
        var r = this.n && this.p.div(this.n);
        !r || r.cmpn(100) > 0
          ? (this.redN = null)
          : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)));
      }
      function c(e, t) {
        (this.curve = e), (this.type = t), (this.precomputed = null);
      }
      (e.exports = u),
        (u.prototype.point = function () {
          throw new Error('Not implemented');
        }),
        (u.prototype.validate = function () {
          throw new Error('Not implemented');
        }),
        (u.prototype._fixedNafMul = function (e, t) {
          s(e.precomputed);
          var r = e._getDoubles(),
            n = o(t, 1, this._bitLength),
            i = (1 << (r.step + 1)) - (r.step % 2 == 0 ? 2 : 1);
          i /= 3;
          for (var a = [], u = 0; u < n.length; u += r.step) {
            var c = 0;
            for (t = u + r.step - 1; t >= u; t--) c = (c << 1) + n[t];
            a.push(c);
          }
          for (
            var f = this.jpoint(null, null, null),
              l = this.jpoint(null, null, null),
              d = i;
            d > 0;
            d--
          ) {
            for (u = 0; u < a.length; u++) {
              (c = a[u]) === d
                ? (l = l.mixedAdd(r.points[u]))
                : c === -d && (l = l.mixedAdd(r.points[u].neg()));
            }
            f = f.add(l);
          }
          return f.toP();
        }),
        (u.prototype._wnafMul = function (e, t) {
          var r = 4,
            n = e._getNAFPoints(r);
          r = n.wnd;
          for (
            var i = n.points,
              a = o(t, r, this._bitLength),
              u = this.jpoint(null, null, null),
              c = a.length - 1;
            c >= 0;
            c--
          ) {
            for (t = 0; c >= 0 && 0 === a[c]; c--) t++;
            if ((c >= 0 && t++, (u = u.dblp(t)), c < 0)) break;
            var f = a[c];
            s(0 !== f),
              (u =
                'affine' === e.type
                  ? f > 0
                    ? u.mixedAdd(i[(f - 1) >> 1])
                    : u.mixedAdd(i[(-f - 1) >> 1].neg())
                  : f > 0
                  ? u.add(i[(f - 1) >> 1])
                  : u.add(i[(-f - 1) >> 1].neg()));
          }
          return 'affine' === e.type ? u.toP() : u;
        }),
        (u.prototype._wnafMulAdd = function (e, t, r, n, i) {
          for (
            var s = this._wnafT1,
              u = this._wnafT2,
              c = this._wnafT3,
              f = 0,
              l = 0;
            l < n;
            l++
          ) {
            var d = (k = t[l])._getNAFPoints(e);
            (s[l] = d.wnd), (u[l] = d.points);
          }
          for (l = n - 1; l >= 1; l -= 2) {
            var h = l - 1,
              p = l;
            if (1 === s[h] && 1 === s[p]) {
              var m = [t[h], null, null, t[p]];
              0 === t[h].y.cmp(t[p].y)
                ? ((m[1] = t[h].add(t[p])),
                  (m[2] = t[h].toJ().mixedAdd(t[p].neg())))
                : 0 === t[h].y.cmp(t[p].y.redNeg())
                ? ((m[1] = t[h].toJ().mixedAdd(t[p])),
                  (m[2] = t[h].add(t[p].neg())))
                : ((m[1] = t[h].toJ().mixedAdd(t[p])),
                  (m[2] = t[h].toJ().mixedAdd(t[p].neg())));
              var b = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                g = a(r[h], r[p]);
              (f = Math.max(g[0].length, f)),
                (c[h] = new Array(f)),
                (c[p] = new Array(f));
              for (var v = 0; v < f; v++) {
                var y = 0 | g[0][v],
                  w = 0 | g[1][v];
                (c[h][v] = b[3 * (y + 1) + (w + 1)]), (c[p][v] = 0), (u[h] = m);
              }
            } else
              (c[h] = o(r[h], s[h], this._bitLength)),
                (c[p] = o(r[p], s[p], this._bitLength)),
                (f = Math.max(c[h].length, f)),
                (f = Math.max(c[p].length, f));
          }
          var _ = this.jpoint(null, null, null),
            S = this._wnafT4;
          for (l = f; l >= 0; l--) {
            for (var M = 0; l >= 0; ) {
              var E = !0;
              for (v = 0; v < n; v++)
                (S[v] = 0 | c[v][l]), 0 !== S[v] && (E = !1);
              if (!E) break;
              M++, l--;
            }
            if ((l >= 0 && M++, (_ = _.dblp(M)), l < 0)) break;
            for (v = 0; v < n; v++) {
              var k,
                x = S[v];
              0 !== x &&
                (x > 0
                  ? (k = u[v][(x - 1) >> 1])
                  : x < 0 && (k = u[v][(-x - 1) >> 1].neg()),
                (_ = 'affine' === k.type ? _.mixedAdd(k) : _.add(k)));
            }
          }
          for (l = 0; l < n; l++) u[l] = null;
          return i ? _ : _.toP();
        }),
        (u.BasePoint = c),
        (c.prototype.eq = function () {
          throw new Error('Not implemented');
        }),
        (c.prototype.validate = function () {
          return this.curve.validate(this);
        }),
        (u.prototype.decodePoint = function (e, t) {
          e = i.toArray(e, t);
          var r = this.p.byteLength();
          if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r)
            return (
              6 === e[0]
                ? s(e[e.length - 1] % 2 == 0)
                : 7 === e[0] && s(e[e.length - 1] % 2 == 1),
              this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r))
            );
          if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r)
            return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
          throw new Error('Unknown point format');
        }),
        (c.prototype.encodeCompressed = function (e) {
          return this.encode(e, !0);
        }),
        (c.prototype._encode = function (e) {
          var t = this.curve.p.byteLength(),
            r = this.getX().toArray('be', t);
          return e
            ? [this.getY().isEven() ? 2 : 3].concat(r)
            : [4].concat(r, this.getY().toArray('be', t));
        }),
        (c.prototype.encode = function (e, t) {
          return i.encode(this._encode(t), e);
        }),
        (c.prototype.precompute = function (e) {
          if (this.precomputed) return this;
          var t = { doubles: null, naf: null, beta: null };
          return (
            (t.naf = this._getNAFPoints(8)),
            (t.doubles = this._getDoubles(4, e)),
            (t.beta = this._getBeta()),
            (this.precomputed = t),
            this
          );
        }),
        (c.prototype._hasDoubles = function (e) {
          if (!this.precomputed) return !1;
          var t = this.precomputed.doubles;
          return (
            !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step)
          );
        }),
        (c.prototype._getDoubles = function (e, t) {
          if (this.precomputed && this.precomputed.doubles)
            return this.precomputed.doubles;
          for (var r = [this], n = this, i = 0; i < t; i += e) {
            for (var o = 0; o < e; o++) n = n.dbl();
            r.push(n);
          }
          return { step: e, points: r };
        }),
        (c.prototype._getNAFPoints = function (e) {
          if (this.precomputed && this.precomputed.naf)
            return this.precomputed.naf;
          for (
            var t = [this],
              r = (1 << e) - 1,
              n = 1 === r ? null : this.dbl(),
              i = 1;
            i < r;
            i++
          )
            t[i] = t[i - 1].add(n);
          return { wnd: e, points: t };
        }),
        (c.prototype._getBeta = function () {
          return null;
        }),
        (c.prototype.dblp = function (e) {
          for (var t = this, r = 0; r < e; r++) t = t.dbl();
          return t;
        });
    },
    function (e, t, r) {
      'use strict';
      for (
        var n = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l', i = {}, o = 0;
        o < n.length;
        o++
      ) {
        var a = n.charAt(o);
        if (void 0 !== i[a]) throw new TypeError(a + ' is ambiguous');
        i[a] = o;
      }
      function s(e) {
        var t = e >> 25;
        return (
          ((33554431 & e) << 5) ^
          (996825010 & -((t >> 0) & 1)) ^
          (642813549 & -((t >> 1) & 1)) ^
          (513874426 & -((t >> 2) & 1)) ^
          (1027748829 & -((t >> 3) & 1)) ^
          (705979059 & -((t >> 4) & 1))
        );
      }
      function u(e) {
        for (var t = 1, r = 0; r < e.length; ++r) {
          var n = e.charCodeAt(r);
          if (n < 33 || n > 126) return 'Invalid prefix (' + e + ')';
          t = s(t) ^ (n >> 5);
        }
        for (t = s(t), r = 0; r < e.length; ++r) {
          var i = e.charCodeAt(r);
          t = s(t) ^ (31 & i);
        }
        return t;
      }
      function c(e, t) {
        if (((t = t || 90), e.length < 8)) return e + ' too short';
        if (e.length > t) return 'Exceeds length limit';
        var r = e.toLowerCase(),
          n = e.toUpperCase();
        if (e !== r && e !== n) return 'Mixed-case string ' + e;
        var o = (e = r).lastIndexOf('1');
        if (-1 === o) return 'No separator character for ' + e;
        if (0 === o) return 'Missing prefix for ' + e;
        var a = e.slice(0, o),
          c = e.slice(o + 1);
        if (c.length < 6) return 'Data too short';
        var f = u(a);
        if ('string' == typeof f) return f;
        for (var l = [], d = 0; d < c.length; ++d) {
          var h = c.charAt(d),
            p = i[h];
          if (void 0 === p) return 'Unknown character ' + h;
          (f = s(f) ^ p), d + 6 >= c.length || l.push(p);
        }
        return 1 !== f ? 'Invalid checksum for ' + e : { prefix: a, words: l };
      }
      function f(e, t, r, n) {
        for (
          var i = 0, o = 0, a = (1 << r) - 1, s = [], u = 0;
          u < e.length;
          ++u
        )
          for (i = (i << t) | e[u], o += t; o >= r; )
            (o -= r), s.push((i >> o) & a);
        if (n) o > 0 && s.push((i << (r - o)) & a);
        else {
          if (o >= t) return 'Excess padding';
          if ((i << (r - o)) & a) return 'Non-zero padding';
        }
        return s;
      }
      e.exports = {
        decodeUnsafe: function () {
          var e = c.apply(null, arguments);
          if ('object' == typeof e) return e;
        },
        decode: function (e) {
          var t = c.apply(null, arguments);
          if ('object' == typeof t) return t;
          throw new Error(t);
        },
        encode: function (e, t, r) {
          if (((r = r || 90), e.length + 7 + t.length > r))
            throw new TypeError('Exceeds length limit');
          var i = u((e = e.toLowerCase()));
          if ('string' == typeof i) throw new Error(i);
          for (var o = e + '1', a = 0; a < t.length; ++a) {
            var c = t[a];
            if (c >> 5 != 0) throw new Error('Non 5-bit word');
            (i = s(i) ^ c), (o += n.charAt(c));
          }
          for (a = 0; a < 6; ++a) i = s(i);
          for (i ^= 1, a = 0; a < 6; ++a) {
            o += n.charAt((i >> (5 * (5 - a))) & 31);
          }
          return o;
        },
        toWordsUnsafe: function (e) {
          var t = f(e, 8, 5, !0);
          if (Array.isArray(t)) return t;
        },
        toWords: function (e) {
          var t = f(e, 8, 5, !0);
          if (Array.isArray(t)) return t;
          throw new Error(t);
        },
        fromWordsUnsafe: function (e) {
          var t = f(e, 5, 8, !1);
          if (Array.isArray(t)) return t;
        },
        fromWords: function (e) {
          var t = f(e, 5, 8, !1);
          if (Array.isArray(t)) return t;
          throw new Error(t);
        },
      };
    },
    function (e, t, r) {
      e.exports = r(2).createHash;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(211);
      t.embed = n.p2data;
      const i = r(216);
      t.p2ms = i.p2ms;
      const o = r(217);
      t.p2pk = o.p2pk;
      const a = r(218);
      t.p2pkh = a.p2pkh;
      const s = r(219);
      t.p2sh = s.p2sh;
      const u = r(220);
      t.p2wpkh = u.p2wpkh;
      const c = r(221);
      t.p2wsh = c.p2wsh;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(38),
        i = r(38),
        o = r(19),
        a = r(0),
        s = r(0),
        u = r(18),
        c = r(4),
        f = r(110);
      function l(e) {
        const t = e.length;
        return f.encodingLength(t) + t;
      }
      const d = Buffer.allocUnsafe(0),
        h = [],
        p = Buffer.from(
          '0000000000000000000000000000000000000000000000000000000000000000',
          'hex'
        ),
        m = Buffer.from(
          '0000000000000000000000000000000000000000000000000000000000000001',
          'hex'
        ),
        b = Buffer.from('ffffffffffffffff', 'hex'),
        g = { script: d, valueBuffer: b };
      class v {
        constructor() {
          (this.version = 1),
            (this.locktime = 0),
            (this.ins = []),
            (this.outs = []);
        }
        static fromBuffer(e, t) {
          let r = 0;
          function i(t) {
            return (r += t), e.slice(r - t, r);
          }
          function o() {
            const t = e.readUInt32LE(r);
            return (r += 4), t;
          }
          function a() {
            const t = n.readUInt64LE(e, r);
            return (r += 8), t;
          }
          function s() {
            const t = f.decode(e, r);
            return (r += f.decode.bytes), t;
          }
          function u() {
            return i(s());
          }
          function c() {
            const e = s(),
              t = [];
            for (let r = 0; r < e; r++) t.push(u());
            return t;
          }
          const l = new v();
          l.version = (function () {
            const t = e.readInt32LE(r);
            return (r += 4), t;
          })();
          const d = e.readUInt8(r),
            p = e.readUInt8(r + 1);
          let m = !1;
          d === v.ADVANCED_TRANSACTION_MARKER &&
            p === v.ADVANCED_TRANSACTION_FLAG &&
            ((r += 2), (m = !0));
          const b = s();
          for (let e = 0; e < b; ++e)
            l.ins.push({
              hash: i(32),
              index: o(),
              script: u(),
              sequence: o(),
              witness: h,
            });
          const g = s();
          for (let e = 0; e < g; ++e) l.outs.push({ value: a(), script: u() });
          if (m) {
            for (let e = 0; e < b; ++e) l.ins[e].witness = c();
            if (!l.hasWitnesses())
              throw new Error('Transaction has superfluous witness data');
          }
          if (((l.locktime = o()), t)) return l;
          if (r !== e.length)
            throw new Error('Transaction has unexpected data');
          return l;
        }
        static fromHex(e) {
          return v.fromBuffer(Buffer.from(e, 'hex'), !1);
        }
        static isCoinbaseHash(e) {
          c(u.Hash256bit, e);
          for (let t = 0; t < 32; ++t) if (0 !== e[t]) return !1;
          return !0;
        }
        isCoinbase() {
          return 1 === this.ins.length && v.isCoinbaseHash(this.ins[0].hash);
        }
        addInput(e, t, r, n) {
          return (
            c(
              u.tuple(
                u.Hash256bit,
                u.UInt32,
                u.maybe(u.UInt32),
                u.maybe(u.Buffer)
              ),
              arguments
            ),
            u.Null(r) && (r = v.DEFAULT_SEQUENCE),
            this.ins.push({
              hash: e,
              index: t,
              script: n || d,
              sequence: r,
              witness: h,
            }) - 1
          );
        }
        addOutput(e, t) {
          return (
            c(u.tuple(u.Buffer, u.Satoshi), arguments),
            this.outs.push({ script: e, value: t }) - 1
          );
        }
        hasWitnesses() {
          return this.ins.some((e) => 0 !== e.witness.length);
        }
        weight() {
          return 3 * this.byteLength(!1) + this.byteLength(!0);
        }
        virtualSize() {
          return Math.ceil(this.weight() / 4);
        }
        byteLength(e = !0) {
          const t = e && this.hasWitnesses();
          return (
            (t ? 10 : 8) +
            f.encodingLength(this.ins.length) +
            f.encodingLength(this.outs.length) +
            this.ins.reduce((e, t) => e + 40 + l(t.script), 0) +
            this.outs.reduce((e, t) => e + 8 + l(t.script), 0) +
            (t
              ? this.ins.reduce(
                  (e, t) =>
                    e +
                    (function (e) {
                      const t = e.length;
                      return (
                        f.encodingLength(t) + e.reduce((e, t) => e + l(t), 0)
                      );
                    })(t.witness),
                  0
                )
              : 0)
          );
        }
        clone() {
          const e = new v();
          return (
            (e.version = this.version),
            (e.locktime = this.locktime),
            (e.ins = this.ins.map((e) => ({
              hash: e.hash,
              index: e.index,
              script: e.script,
              sequence: e.sequence,
              witness: e.witness,
            }))),
            (e.outs = this.outs.map((e) => ({
              script: e.script,
              value: e.value,
            }))),
            e
          );
        }
        hashForSignature(e, t, r) {
          if (
            (c(u.tuple(u.UInt32, u.Buffer, u.Number), arguments),
            e >= this.ins.length)
          )
            return m;
          const n = a.compile(
              a.decompile(t).filter((e) => e !== s.OPS.OP_CODESEPARATOR)
            ),
            i = this.clone();
          if ((31 & r) === v.SIGHASH_NONE)
            (i.outs = []),
              i.ins.forEach((t, r) => {
                r !== e && (t.sequence = 0);
              });
          else if ((31 & r) === v.SIGHASH_SINGLE) {
            if (e >= this.outs.length) return m;
            i.outs.length = e + 1;
            for (let t = 0; t < e; t++) i.outs[t] = g;
            i.ins.forEach((t, r) => {
              r !== e && (t.sequence = 0);
            });
          }
          r & v.SIGHASH_ANYONECANPAY
            ? ((i.ins = [i.ins[e]]), (i.ins[0].script = n))
            : (i.ins.forEach((e) => {
                e.script = d;
              }),
              (i.ins[e].script = n));
          const f = Buffer.allocUnsafe(i.byteLength(!1) + 4);
          return (
            f.writeInt32LE(r, f.length - 4),
            i.__toBuffer(f, 0, !1),
            o.hash256(f)
          );
        }
        hashForWitnessV0(e, t, r, i) {
          c(u.tuple(u.UInt32, u.Buffer, u.Satoshi, u.UInt32), arguments);
          let a = Buffer.from([]),
            s = 0;
          function d(e) {
            s += e.copy(a, s);
          }
          function h(e) {
            s = a.writeUInt32LE(e, s);
          }
          function m(e) {
            s = n.writeUInt64LE(a, e, s);
          }
          function b(e) {
            var t;
            (t = e.length), f.encode(t, a, s), (s += f.encode.bytes), d(e);
          }
          let g = p,
            y = p,
            w = p;
          if (
            (i & v.SIGHASH_ANYONECANPAY ||
              ((a = Buffer.allocUnsafe(36 * this.ins.length)),
              (s = 0),
              this.ins.forEach((e) => {
                d(e.hash), h(e.index);
              }),
              (y = o.hash256(a))),
            i & v.SIGHASH_ANYONECANPAY ||
              (31 & i) === v.SIGHASH_SINGLE ||
              (31 & i) === v.SIGHASH_NONE ||
              ((a = Buffer.allocUnsafe(4 * this.ins.length)),
              (s = 0),
              this.ins.forEach((e) => {
                h(e.sequence);
              }),
              (w = o.hash256(a))),
            (31 & i) !== v.SIGHASH_SINGLE && (31 & i) !== v.SIGHASH_NONE)
          ) {
            const e = this.outs.reduce((e, t) => e + 8 + l(t.script), 0);
            (a = Buffer.allocUnsafe(e)),
              (s = 0),
              this.outs.forEach((e) => {
                m(e.value), b(e.script);
              }),
              (g = o.hash256(a));
          } else if ((31 & i) === v.SIGHASH_SINGLE && e < this.outs.length) {
            const t = this.outs[e];
            (a = Buffer.allocUnsafe(8 + l(t.script))),
              (s = 0),
              m(t.value),
              b(t.script),
              (g = o.hash256(a));
          }
          (a = Buffer.allocUnsafe(156 + l(t))), (s = 0);
          const _ = this.ins[e];
          return (
            h(this.version),
            d(y),
            d(w),
            d(_.hash),
            h(_.index),
            b(t),
            m(r),
            h(_.sequence),
            d(g),
            h(this.locktime),
            h(i),
            o.hash256(a)
          );
        }
        getHash(e) {
          return e && this.isCoinbase()
            ? Buffer.alloc(32, 0)
            : o.hash256(this.__toBuffer(void 0, void 0, e));
        }
        getId() {
          return i.reverseBuffer(this.getHash(!1)).toString('hex');
        }
        toBuffer(e, t) {
          return this.__toBuffer(e, t, !0);
        }
        toHex() {
          return this.toBuffer(void 0, void 0).toString('hex');
        }
        setInputScript(e, t) {
          c(u.tuple(u.Number, u.Buffer), arguments), (this.ins[e].script = t);
        }
        setWitness(e, t) {
          c(u.tuple(u.Number, [u.Buffer]), arguments),
            (this.ins[e].witness = t);
        }
        __toBuffer(e, t, r = !1) {
          e || (e = Buffer.allocUnsafe(this.byteLength(r)));
          let i = t || 0;
          function o(t) {
            i += t.copy(e, i);
          }
          function a(t) {
            i = e.writeUInt8(t, i);
          }
          function s(t) {
            i = e.writeUInt32LE(t, i);
          }
          function u(t) {
            f.encode(t, e, i), (i += f.encode.bytes);
          }
          function c(e) {
            u(e.length), o(e);
          }
          var l;
          (l = this.version), (i = e.writeInt32LE(l, i));
          const d = r && this.hasWitnesses();
          return (
            d &&
              (a(v.ADVANCED_TRANSACTION_MARKER),
              a(v.ADVANCED_TRANSACTION_FLAG)),
            u(this.ins.length),
            this.ins.forEach((e) => {
              o(e.hash), s(e.index), c(e.script), s(e.sequence);
            }),
            u(this.outs.length),
            this.outs.forEach((t) => {
              void 0 !== t.value
                ? (function (t) {
                    i = n.writeUInt64LE(e, t, i);
                  })(t.value)
                : o(t.valueBuffer),
                c(t.script);
            }),
            d &&
              this.ins.forEach((e) => {
                var t;
                u((t = e.witness).length), t.forEach(c);
              }),
            s(this.locktime),
            void 0 !== t ? e.slice(t, i) : e
          );
        }
      }
      (v.DEFAULT_SEQUENCE = 4294967295),
        (v.SIGHASH_ALL = 1),
        (v.SIGHASH_NONE = 2),
        (v.SIGHASH_SINGLE = 3),
        (v.SIGHASH_ANYONECANPAY = 128),
        (v.ADVANCED_TRANSACTION_MARKER = 0),
        (v.ADVANCED_TRANSACTION_FLAG = 1),
        (t.Transaction = v);
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      function n(e) {
        if (e < 0 || e > 9007199254740991 || e % 1 != 0)
          throw new RangeError('value out of range');
      }
      function i(e) {
        return n(e), e < 253 ? 1 : e <= 65535 ? 3 : e <= 4294967295 ? 5 : 9;
      }
      (t.encode = function e(t, r, o) {
        if ((n(t), r || (r = Buffer.allocUnsafe(i(t))), !Buffer.isBuffer(r)))
          throw new TypeError('buffer must be a Buffer instance');
        return (
          o || (o = 0),
          t < 253
            ? (r.writeUInt8(t, o), Object.assign(e, { bytes: 1 }))
            : t <= 65535
            ? (r.writeUInt8(253, o),
              r.writeUInt16LE(t, o + 1),
              Object.assign(e, { bytes: 3 }))
            : t <= 4294967295
            ? (r.writeUInt8(254, o),
              r.writeUInt32LE(t, o + 1),
              Object.assign(e, { bytes: 5 }))
            : (r.writeUInt8(255, o),
              r.writeUInt32LE(t >>> 0, o + 1),
              r.writeUInt32LE((t / 4294967296) | 0, o + 5),
              Object.assign(e, { bytes: 9 })),
          r
        );
      }),
        (t.decode = function e(t, r) {
          if (!Buffer.isBuffer(t))
            throw new TypeError('buffer must be a Buffer instance');
          r || (r = 0);
          const i = t.readUInt8(r);
          if (i < 253) return Object.assign(e, { bytes: 1 }), i;
          if (253 === i)
            return Object.assign(e, { bytes: 3 }), t.readUInt16LE(r + 1);
          if (254 === i)
            return Object.assign(e, { bytes: 5 }), t.readUInt32LE(r + 1);
          {
            Object.assign(e, { bytes: 9 });
            const i = t.readUInt32LE(r + 1),
              o = 4294967296 * t.readUInt32LE(r + 5) + i;
            return n(o), o;
          }
        }),
        (t.encodingLength = i);
    },
    ,
    ,
    ,
    function (e, t, r) {
      'use strict';
      var n = t;
      (n.version = r(157).version),
        (n.utils = r(7)),
        (n.rand = r(87)),
        (n.curve = r(88)),
        (n.curves = r(54)),
        (n.ec = r(169)),
        (n.eddsa = r(173));
    },
    function (e, t, r) {
      'use strict';
      var n,
        i = t,
        o = r(55),
        a = r(88),
        s = r(7).assert;
      function u(e) {
        'short' === e.type
          ? (this.curve = new a.short(e))
          : 'edwards' === e.type
          ? (this.curve = new a.edwards(e))
          : (this.curve = new a.mont(e)),
          (this.g = this.curve.g),
          (this.n = this.curve.n),
          (this.hash = e.hash),
          s(this.g.validate(), 'Invalid curve'),
          s(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
      }
      function c(e, t) {
        Object.defineProperty(i, e, {
          configurable: !0,
          enumerable: !0,
          get: function () {
            var r = new u(t);
            return (
              Object.defineProperty(i, e, {
                configurable: !0,
                enumerable: !0,
                value: r,
              }),
              r
            );
          },
        });
      }
      (i.PresetCurve = u),
        c('p192', {
          type: 'short',
          prime: 'p192',
          p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
          a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
          b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
          n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
          hash: o.sha256,
          gRed: !1,
          g: [
            '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
            '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811',
          ],
        }),
        c('p224', {
          type: 'short',
          prime: 'p224',
          p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
          a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
          b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
          n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
          hash: o.sha256,
          gRed: !1,
          g: [
            'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
            'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34',
          ],
        }),
        c('p256', {
          type: 'short',
          prime: null,
          p:
            'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
          a:
            'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
          b:
            '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
          n:
            'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
          hash: o.sha256,
          gRed: !1,
          g: [
            '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
            '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5',
          ],
        }),
        c('p384', {
          type: 'short',
          prime: null,
          p:
            'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff',
          a:
            'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc',
          b:
            'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
          n:
            'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
          hash: o.sha384,
          gRed: !1,
          g: [
            'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7',
            '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f',
          ],
        }),
        c('p521', {
          type: 'short',
          prime: null,
          p:
            '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff',
          a:
            '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc',
          b:
            '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
          n:
            '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
          hash: o.sha512,
          gRed: !1,
          g: [
            '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
            '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650',
          ],
        }),
        c('curve25519', {
          type: 'mont',
          prime: 'p25519',
          p:
            '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
          a: '76d06',
          b: '1',
          n:
            '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
          hash: o.sha256,
          gRed: !1,
          g: ['9'],
        }),
        c('ed25519', {
          type: 'edwards',
          prime: 'p25519',
          p:
            '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
          a: '-1',
          c: '1',
          d:
            '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
          n:
            '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
          hash: o.sha256,
          gRed: !1,
          g: [
            '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',
            '6666666666666666666666666666666666666666666666666666666666666658',
          ],
        });
      try {
        n = r(168);
      } catch (e) {
        n = void 0;
      }
      c('secp256k1', {
        type: 'short',
        prime: 'k256',
        p:
          'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
        a: '0',
        b: '7',
        n:
          'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
        h: '1',
        hash: o.sha256,
        beta:
          '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
        lambda:
          '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
        basis: [
          {
            a: '3086d221a7d46bcde86c90e49284eb15',
            b: '-e4437ed6010e88286f547fa90abfe4c3',
          },
          {
            a: '114ca50f7a8e2f3f657c1108d9d44cfd8',
            b: '3086d221a7d46bcde86c90e49284eb15',
          },
        ],
        gRed: !1,
        g: [
          '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
          '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
          n,
        ],
      });
    },
    function (e, t, r) {
      var n = t;
      (n.utils = r(15)),
        (n.common = r(36)),
        (n.sha = r(162)),
        (n.ripemd = r(166)),
        (n.hmac = r(167)),
        (n.sha1 = n.sha.sha1),
        (n.sha256 = n.sha.sha256),
        (n.sha224 = n.sha.sha224),
        (n.sha384 = n.sha.sha384),
        (n.sha512 = n.sha.sha512),
        (n.ripemd160 = n.ripemd.ripemd160);
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      function i(e) {
        return encodeURIComponent(e)
          .replace(/%40/gi, '@')
          .replace(/%3A/gi, ':')
          .replace(/%24/g, '$')
          .replace(/%2C/gi, ',')
          .replace(/%20/g, '+')
          .replace(/%5B/gi, '[')
          .replace(/%5D/gi, ']');
      }
      e.exports = function (e, t, r) {
        if (!t) return e;
        var o;
        if (r) o = r(t);
        else if (n.isURLSearchParams(t)) o = t.toString();
        else {
          var a = [];
          n.forEach(t, function (e, t) {
            null != e &&
              (n.isArray(e) ? (t += '[]') : (e = [e]),
              n.forEach(e, function (e) {
                n.isDate(e)
                  ? (e = e.toISOString())
                  : n.isObject(e) && (e = JSON.stringify(e)),
                  a.push(i(t) + '=' + i(e));
              }));
          }),
            (o = a.join('&'));
        }
        if (o) {
          var s = e.indexOf('#');
          -1 !== s && (e = e.slice(0, s)),
            (e += (-1 === e.indexOf('?') ? '?' : '&') + o);
        }
        return e;
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(97);
      e.exports = function (e, t, r, i, o) {
        var a = new Error(e);
        return n(a, t, r, i, o);
      };
    },
    function (e, t, r) {
      e.exports = r(2).createHmac;
    },
    function (e, t) {
      var r = {
        Array: function (e) {
          return null != e && e.constructor === Array;
        },
        Boolean: function (e) {
          return 'boolean' == typeof e;
        },
        Function: function (e) {
          return 'function' == typeof e;
        },
        Nil: function (e) {
          return null == e;
        },
        Number: function (e) {
          return 'number' == typeof e;
        },
        Object: function (e) {
          return 'object' == typeof e;
        },
        String: function (e) {
          return 'string' == typeof e;
        },
        '': function () {
          return !0;
        },
      };
      for (var n in ((r.Null = r.Nil), r))
        r[n].toJSON = function (e) {
          return e;
        }.bind(null, n);
      e.exports = r;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(8),
        i = r(47),
        o = r(0),
        a = r(18),
        s = r(45),
        u = r(37),
        c = r(4);
      function f(e) {
        const t = u.decode(e);
        if (t.length < 21) throw new TypeError(e + ' is too short');
        if (t.length > 21) throw new TypeError(e + ' is too long');
        return { version: t.readUInt8(0), hash: t.slice(1) };
      }
      function l(e) {
        const t = s.decode(e),
          r = s.fromWords(t.words.slice(1));
        return { version: t.words[0], prefix: t.prefix, data: Buffer.from(r) };
      }
      (t.fromBase58Check = f),
        (t.fromBech32 = l),
        (t.toBase58Check = function (e, t) {
          c(a.tuple(a.Hash160bit, a.UInt8), arguments);
          const r = Buffer.allocUnsafe(21);
          return r.writeUInt8(t, 0), e.copy(r, 1), u.encode(r);
        }),
        (t.toBech32 = function (e, t, r) {
          const n = s.toWords(e);
          return n.unshift(t), s.encode(r, n);
        }),
        (t.fromOutputScript = function (e, t) {
          t = t || n.bitcoin;
          try {
            return i.p2pkh({ output: e, network: t }).address;
          } catch (e) {}
          try {
            return i.p2sh({ output: e, network: t }).address;
          } catch (e) {}
          try {
            return i.p2wpkh({ output: e, network: t }).address;
          } catch (e) {}
          try {
            return i.p2wsh({ output: e, network: t }).address;
          } catch (e) {}
          throw new Error(o.toASM(e) + ' has no matching Address');
        }),
        (t.toOutputScript = function (e, t) {
          let r, o;
          t = t || n.bitcoin;
          try {
            r = f(e);
          } catch (e) {}
          if (r) {
            if (r.version === t.pubKeyHash)
              return i.p2pkh({ hash: r.hash }).output;
            if (r.version === t.scriptHash)
              return i.p2sh({ hash: r.hash }).output;
          } else {
            try {
              o = l(e);
            } catch (e) {}
            if (o) {
              if (o.prefix !== t.bech32)
                throw new Error(e + ' has an invalid prefix');
              if (0 === o.version) {
                if (20 === o.data.length)
                  return i.p2wpkh({ hash: o.data }).output;
                if (32 === o.data.length)
                  return i.p2wsh({ hash: o.data }).output;
              }
            }
          }
          throw new Error(e + ' has no matching Script');
        });
    },
    function (e) {
      e.exports = JSON.parse(
        '{"OP_FALSE":0,"OP_0":0,"OP_PUSHDATA1":76,"OP_PUSHDATA2":77,"OP_PUSHDATA4":78,"OP_1NEGATE":79,"OP_RESERVED":80,"OP_TRUE":81,"OP_1":81,"OP_2":82,"OP_3":83,"OP_4":84,"OP_5":85,"OP_6":86,"OP_7":87,"OP_8":88,"OP_9":89,"OP_10":90,"OP_11":91,"OP_12":92,"OP_13":93,"OP_14":94,"OP_15":95,"OP_16":96,"OP_NOP":97,"OP_VER":98,"OP_IF":99,"OP_NOTIF":100,"OP_VERIF":101,"OP_VERNOTIF":102,"OP_ELSE":103,"OP_ENDIF":104,"OP_VERIFY":105,"OP_RETURN":106,"OP_TOALTSTACK":107,"OP_FROMALTSTACK":108,"OP_2DROP":109,"OP_2DUP":110,"OP_3DUP":111,"OP_2OVER":112,"OP_2ROT":113,"OP_2SWAP":114,"OP_IFDUP":115,"OP_DEPTH":116,"OP_DROP":117,"OP_DUP":118,"OP_NIP":119,"OP_OVER":120,"OP_PICK":121,"OP_ROLL":122,"OP_ROT":123,"OP_SWAP":124,"OP_TUCK":125,"OP_CAT":126,"OP_SUBSTR":127,"OP_LEFT":128,"OP_RIGHT":129,"OP_SIZE":130,"OP_INVERT":131,"OP_AND":132,"OP_OR":133,"OP_XOR":134,"OP_EQUAL":135,"OP_EQUALVERIFY":136,"OP_RESERVED1":137,"OP_RESERVED2":138,"OP_1ADD":139,"OP_1SUB":140,"OP_2MUL":141,"OP_2DIV":142,"OP_NEGATE":143,"OP_ABS":144,"OP_NOT":145,"OP_0NOTEQUAL":146,"OP_ADD":147,"OP_SUB":148,"OP_MUL":149,"OP_DIV":150,"OP_MOD":151,"OP_LSHIFT":152,"OP_RSHIFT":153,"OP_BOOLAND":154,"OP_BOOLOR":155,"OP_NUMEQUAL":156,"OP_NUMEQUALVERIFY":157,"OP_NUMNOTEQUAL":158,"OP_LESSTHAN":159,"OP_GREATERTHAN":160,"OP_LESSTHANOREQUAL":161,"OP_GREATERTHANOREQUAL":162,"OP_MIN":163,"OP_MAX":164,"OP_WITHIN":165,"OP_RIPEMD160":166,"OP_SHA1":167,"OP_SHA256":168,"OP_HASH160":169,"OP_HASH256":170,"OP_CODESEPARATOR":171,"OP_CHECKSIG":172,"OP_CHECKSIGVERIFY":173,"OP_CHECKMULTISIG":174,"OP_CHECKMULTISIGVERIFY":175,"OP_NOP1":176,"OP_NOP2":177,"OP_CHECKLOCKTIMEVERIFY":177,"OP_NOP3":178,"OP_CHECKSEQUENCEVERIFY":178,"OP_NOP4":179,"OP_NOP5":180,"OP_NOP6":181,"OP_NOP7":182,"OP_NOP8":183,"OP_NOP9":184,"OP_NOP10":185,"OP_PUBKEYHASH":253,"OP_PUBKEY":254,"OP_INVALIDOPCODE":255}'
      );
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(8),
        i = r(18),
        o = r(27),
        a = r(109),
        s = r(4),
        u = r(107),
        c = s.maybe(
          s.compile({
            compressed: i.maybe(i.Boolean),
            network: i.maybe(i.Network),
          })
        );
      class f {
        constructor(e, t, r) {
          (this.__D = e),
            (this.__Q = t),
            (this.lowR = !1),
            void 0 === r && (r = {}),
            (this.compressed = void 0 === r.compressed || r.compressed),
            (this.network = r.network || n.bitcoin),
            void 0 !== t && (this.__Q = o.pointCompress(t, this.compressed));
        }
        get privateKey() {
          return this.__D;
        }
        get publicKey() {
          return (
            this.__Q ||
              (this.__Q = o.pointFromScalar(this.__D, this.compressed)),
            this.__Q
          );
        }
        toWIF() {
          if (!this.__D) throw new Error('Missing private key');
          return u.encode(this.network.wif, this.__D, this.compressed);
        }
        sign(e, t) {
          if (!this.__D) throw new Error('Missing private key');
          if ((void 0 === t && (t = this.lowR), !1 === t))
            return o.sign(e, this.__D);
          {
            let t = o.sign(e, this.__D);
            const r = Buffer.alloc(32, 0);
            let n = 0;
            for (; t[0] > 127; )
              n++,
                r.writeUIntLE(n, 0, 6),
                (t = o.signWithEntropy(e, this.__D, r));
            return t;
          }
        }
        verify(e, t) {
          return o.verify(e, this.publicKey, t);
        }
      }
      function l(e, t) {
        if ((s(i.Buffer256bit, e), !o.isPrivate(e)))
          throw new TypeError('Private key not in range [1, n)');
        return s(c, t), new f(e, void 0, t);
      }
      (t.fromPrivateKey = l),
        (t.fromPublicKey = function (e, t) {
          return s(o.isPoint, e), s(c, t), new f(void 0, e, t);
        }),
        (t.fromWIF = function (e, t) {
          const r = u.decode(e),
            o = r.version;
          if (i.Array(t)) {
            if (!(t = t.filter((e) => o === e.wif).pop()))
              throw new Error('Unknown network version');
          } else if (((t = t || n.bitcoin), o !== t.wif))
            throw new Error('Invalid network version');
          return l(r.privateKey, { compressed: r.compressed, network: t });
        }),
        (t.makeRandom = function (e) {
          s(c, e), void 0 === e && (e = {});
          const t = e.rng || a;
          let r;
          do {
            (r = t(32)), s(i.Buffer256bit, r);
          } while (!o.isPrivate(r));
          return l(r, e);
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9),
        i = r(228),
        o = r(229),
        a = r(230),
        s = r(231),
        u = r(232),
        c = r(233),
        f = r(234),
        l = r(235),
        d = r(236),
        h = r(237),
        p = r(238),
        m = r(239),
        b = r(240),
        g = { unsignedTx: o, globalXpub: i, checkPubkey: p.makeChecker([]) };
      t.globals = g;
      const v = {
        nonWitnessUtxo: u,
        partialSig: c,
        sighashType: l,
        finalScriptSig: a,
        finalScriptWitness: s,
        porCommitment: f,
        witnessUtxo: d,
        bip32Derivation: h.makeConverter(n.InputTypes.BIP32_DERIVATION),
        redeemScript: m.makeConverter(n.InputTypes.REDEEM_SCRIPT),
        witnessScript: b.makeConverter(n.InputTypes.WITNESS_SCRIPT),
        checkPubkey: p.makeChecker([
          n.InputTypes.PARTIAL_SIG,
          n.InputTypes.BIP32_DERIVATION,
        ]),
      };
      t.inputs = v;
      const y = {
        bip32Derivation: h.makeConverter(n.OutputTypes.BIP32_DERIVATION),
        redeemScript: m.makeConverter(n.OutputTypes.REDEEM_SCRIPT),
        witnessScript: b.makeConverter(n.OutputTypes.WITNESS_SCRIPT),
        checkPubkey: p.makeChecker([n.OutputTypes.BIP32_DERIVATION]),
      };
      t.outputs = y;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(49);
      function i(e) {
        const t = e.key.length,
          r = e.value.length,
          i = n.encodingLength(t),
          o = n.encodingLength(r),
          a = Buffer.allocUnsafe(i + t + o + r);
        return (
          n.encode(t, a, 0),
          e.key.copy(a, i),
          n.encode(r, a, i + t),
          e.value.copy(a, i + t + o),
          a
        );
      }
      function o(e, t) {
        if ('number' != typeof e)
          throw new Error('cannot write a non-number as a number');
        if (e < 0)
          throw new Error(
            'specified a negative value for writing an unsigned value'
          );
        if (e > t) throw new Error('RangeError: value out of range');
        if (Math.floor(e) !== e)
          throw new Error('value has a fractional component');
      }
      (t.range = (e) => [...Array(e).keys()]),
        (t.reverseBuffer = function (e) {
          if (e.length < 1) return e;
          let t = e.length - 1,
            r = 0;
          for (let n = 0; n < e.length / 2; n++)
            (r = e[n]), (e[n] = e[t]), (e[t] = r), t--;
          return e;
        }),
        (t.keyValsToBuffer = function (e) {
          const t = e.map(i);
          return t.push(Buffer.from([0])), Buffer.concat(t);
        }),
        (t.keyValToBuffer = i),
        (t.readUInt64LE = function (e, t) {
          const r = e.readUInt32LE(t);
          let n = e.readUInt32LE(t + 4);
          return (n *= 4294967296), o(n + r, 9007199254740991), n + r;
        }),
        (t.writeUInt64LE = function (e, t, r) {
          return (
            o(t, 9007199254740991),
            e.writeInt32LE(-1 & t, r),
            e.writeUInt32LE(Math.floor(t / 4294967296), r + 4),
            r + 8
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(244);
      t.input = n;
      const i = r(245);
      t.output = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(247);
      t.input = n;
      const i = r(248);
      t.output = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(249);
      t.input = n;
      const i = r(250);
      t.output = i;
    },
    function (e, t) {
      var r = Math.pow(2, 30) - 1;
      function n(e, t) {
        if ('string' != typeof e && !Buffer.isBuffer(e))
          throw new TypeError(t + ' must be a buffer or string');
      }
      e.exports = function (e, t, i, o) {
        if ((n(e, 'Password'), n(t, 'Salt'), 'number' != typeof i))
          throw new TypeError('Iterations not a number');
        if (i < 0) throw new TypeError('Bad iterations');
        if ('number' != typeof o)
          throw new TypeError('Key length not a number');
        if (o < 0 || o > r || o != o) throw new TypeError('Bad key length');
      };
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function (e, t) {
      e.exports = require('zlib');
    },
    function (e, t, r) {
      r(123).config(),
        (e.exports = {
          TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
          TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
          TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
          TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
          PERSPECTIVE_API_KEY: process.env.PERSPECTIVE_API_KEY,
          PERSPECTIVE_API_THRESHOLD: process.env.PERSPECTIVE_API_THRESHOLD,
          BLUZELLE_MNEMONIC:
            'around buzz diagram captain obtain detail salon mango muffin brother morning jeans display attend knife carry green dwarf vendor hungry fan route pumpkin car',
          BLUZELLE_ENDPOINT: 'http://testnet.public.bluzelle.com:1317',
          BLUZELLE_CHAIN_ID: 'bluzelle',
          TUMBLR_CONSUMER_KEY: process.env.TUMBLR_CONSUMER_KEY,
          TUMBLR_CONSUMER_SECRET: process.env.TUMBLR_CONSUMER_SECRET,
          TUMBLR_TOKEN: process.env.TUMBLR_TOKEN,
          TUMBLR_TOKEN_SECRET: process.env.TUMBLR_TOKEN_SECRET,
        });
    },
    ,
    ,
    ,
    ,
    ,
    function (e, t, r) {
      'use strict';
      var n =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (i, o) {
              function a(e) {
                try {
                  u(n.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function s(e) {
                try {
                  u(n.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function u(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t);
                        })).then(a, s);
              }
              u((n = n.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          },
        o =
          (this && this.__importStar) ||
          function (e) {
            if (e && e.__esModule) return e;
            var t = {};
            if (null != e)
              for (var r in e)
                Object.hasOwnProperty.call(e, r) && (t[r] = e[r]);
            return (t.default = e), t;
          };
      Object.defineProperty(t, '__esModule', { value: !0 });
      const a = r(85),
        s = r(43),
        u = r(43),
        c = r(43),
        f = i(r(20)),
        l = o(r(92));
      const d = (e) =>
        JSON.parse(
          (function (e) {
            let t = '';
            for (let r = 0; r < e.length; r += 2)
              t += String.fromCharCode(parseInt(e.substr(r, 2), 16));
            return t;
          })(e)
        );
      t.API = class {
        constructor({ mnemonic: e, endpoint: t, uuid: r, chain_id: n }) {
          (this.address = ''),
            f.default(a.isString(e), 'mnemonic must be a string'),
            f.default(a.isString(r), 'uuid must be a string'),
            (this.mnemonic = e),
            (this.uuid = r),
            (this.chain_id = n || 'bluzelle'),
            (this.endpoint = t || 'http://localhost:1317');
        }
        init() {
          return n(this, void 0, void 0, function* () {
            this.address = yield l.init(this.mnemonic, this.endpoint);
          });
        }
        status() {
          console.log('status');
        }
        create(e, t, r, i = {}) {
          return n(this, void 0, void 0, function* () {
            f.default(a.isString(e), 'Key must be a string'),
              f.default(a.isString(t), 'Value must be a string');
            const n = u.convertLease(i);
            return (
              f.default(n >= 0, 'Invalid lease time'),
              this.doTx(
                { Key: e, Value: t, Lease: n.toString() },
                'post',
                'create',
                r
              )
            );
          });
        }
        update(e, t, r, i) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              f.default(a.isString(t), 'Value must be a string'),
              this.doTx(
                { Key: e, Value: t, Lease: u.convertLease({}).toString() },
                'post',
                'update',
                r
              )
            );
          });
        }
        read(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              l
                .query(
                  `crud/${t ? 'pread' : 'read'}/${this.uuid}/${c.encodeSafe(e)}`
                )
                .then((e) => e.result.value)
            );
          });
        }
        txRead(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              this.doTx({ Key: e }, 'post', 'read', t).then((e) => d(e).value)
            );
          });
        }
        delete(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              this.doTx({ Key: e }, 'delete', 'delete', t)
            );
          });
        }
        has(e) {
          return n(this, void 0, void 0, function* () {
            f.default(a.isString(e), 'Key must be a string');
            const t = c.encodeSafe(e);
            return l
              .query(`crud/has/${this.uuid}/${t}`)
              .then(({ result: e }) => e.has);
          });
        }
        txHas(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              this.doTx({ Key: e }, 'post', 'has', t).then((e) => d(e).has)
            );
          });
        }
        keys() {
          return n(this, void 0, void 0, function* () {
            return l
              .query('crud/keys/' + this.uuid)
              .then(({ result: e }) => e.keys || []);
          });
        }
        txKeys(e) {
          return n(this, void 0, void 0, function* () {
            return this.doTx({}, 'post', 'keys', e).then(
              (e) => d(e).keys || []
            );
          });
        }
        rename(e, t, r) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              f.default(a.isString(t), 'New key must be a string'),
              this.doTx({ Key: e, NewKey: t }, 'post', 'rename', r)
            );
          });
        }
        count() {
          return n(this, void 0, void 0, function* () {
            return l
              .query('/crud/count/' + this.uuid)
              .then(({ result: e }) => parseInt(e.count));
          });
        }
        txCount(e) {
          return n(this, void 0, void 0, function* () {
            return this.doTx({}, 'post', 'count', e).then((e) =>
              parseInt(d(e).count)
            );
          });
        }
        deleteAll(e) {
          return n(this, void 0, void 0, function* () {
            return this.doTx({}, 'post', 'deleteall', e);
          });
        }
        keyValues() {
          return n(this, void 0, void 0, function* () {
            return l
              .query('/crud/keyvalues/' + this.uuid)
              .then(({ result: e }) => e.keyvalues);
          });
        }
        txKeyValues(e) {
          return n(this, void 0, void 0, function* () {
            return this.doTx({}, 'post', 'keyvalues', e).then(
              (e) => d(e).keyvalues
            );
          });
        }
        multiUpdate(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(Array.isArray(e), 'keyvalues must be an array'),
              e.forEach(({ key: e, value: t }, r, n) => {
                f.default(a.isString(e), 'All keys must be strings'),
                  f.default(a.isString(t), 'All values must be strings');
              }),
              this.doTx({ KeyValues: e }, 'post', 'multiupdate', t)
            );
          });
        }
        getLease(e) {
          return n(this, void 0, void 0, function* () {
            f.default(a.isString(e), 'Key must be a string');
            const t = c.encodeSafe(e);
            return l
              .query(`crud/getlease/${this.uuid}/${t}`)
              .then(({ result: e }) => e.lease * s.BLOCK_TIME_IN_SECONDS);
          });
        }
        txGetLease(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(a.isString(e), 'Key must be a string'),
              this.doTx({ Key: e }, 'post', 'getlease', t).then(
                (e) => d(e).lease * s.BLOCK_TIME_IN_SECONDS
              )
            );
          });
        }
        renewLease(e, t, r) {
          return n(this, void 0, void 0, function* () {
            f.default(a.isString(e), 'Key must be a string');
            const n = u.convertLease(r);
            return (
              f.default(n >= 0, 'Invalid lease time'),
              this.doTx(
                { Key: e, Lease: n.toString() },
                'post',
                'renewlease',
                t
              )
            );
          });
        }
        renewLeaseAll(e, t = {}) {
          return n(this, void 0, void 0, function* () {
            const r = u.convertLease(t);
            return (
              f.default(r >= 0, 'Invalid lease time'),
              this.doTx({ Lease: r.toString() }, 'post', 'renewleaseall', e)
            );
          });
        }
        getNShortestLeases(e) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(e >= 0, Error('Invalid value specified')),
              l
                .query(`crud/getnshortestleases/${this.uuid}/${e}`)
                .then(({ result: e }) =>
                  e.keyleases.map(({ key: e, lease: t }) => ({
                    key: e,
                    lease: parseInt(t) * s.BLOCK_TIME_IN_SECONDS,
                  }))
                )
            );
          });
        }
        txGetNShortestLeases(e, t) {
          return n(this, void 0, void 0, function* () {
            return (
              f.default(e >= 0, 'Invalid value specified'),
              this.doTx({ N: e }, 'post', 'getnshortestleases', t).then((e) =>
                d(e).keyleases.map(({ key: e, lease: t }) => ({
                  key: e,
                  lease: parseInt(t) * s.BLOCK_TIME_IN_SECONDS,
                }))
              )
            );
          });
        }
        account() {
          return n(this, void 0, void 0, function* () {
            return l
              .query('auth/accounts/' + this.address)
              .then(({ result: e }) => e.value);
          });
        }
        version() {
          return n(this, void 0, void 0, function* () {
            return l
              .query('node_info')
              .then((e) => e.application_version.version);
          });
        }
        doTx(e, t, r, n) {
          const i = Object.assign(
            {
              BaseReq: { from: this.address, chain_id: this.chain_id },
              UUID: this.uuid,
              Owner: this.address,
            },
            e
          );
          return l.sendTransaction(t, 'crud/' + r, i, n);
        }
      };
    },
    function (e, t, r) {
      (function (e) {
        var n;
        /**
         * @license
         * Lodash <https://lodash.com/>
         * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
         * Released under MIT license <https://lodash.com/license>
         * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
         * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
         */ (function () {
          var i = 'Expected a function',
            o = '__lodash_placeholder__',
            a = [
              ['ary', 128],
              ['bind', 1],
              ['bindKey', 2],
              ['curry', 8],
              ['curryRight', 16],
              ['flip', 512],
              ['partial', 32],
              ['partialRight', 64],
              ['rearg', 256],
            ],
            s = '[object Arguments]',
            u = '[object Array]',
            c = '[object Boolean]',
            f = '[object Date]',
            l = '[object Error]',
            d = '[object Function]',
            h = '[object GeneratorFunction]',
            p = '[object Map]',
            m = '[object Number]',
            b = '[object Object]',
            g = '[object RegExp]',
            v = '[object Set]',
            y = '[object String]',
            w = '[object Symbol]',
            _ = '[object WeakMap]',
            S = '[object ArrayBuffer]',
            M = '[object DataView]',
            E = '[object Float32Array]',
            k = '[object Float64Array]',
            x = '[object Int8Array]',
            T = '[object Int16Array]',
            O = '[object Int32Array]',
            I = '[object Uint8Array]',
            A = '[object Uint16Array]',
            P = '[object Uint32Array]',
            N = /\b__p \+= '';/g,
            B = /\b(__p \+=) '' \+/g,
            C = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
            R = /&(?:amp|lt|gt|quot|#39);/g,
            j = /[&<>"']/g,
            z = RegExp(R.source),
            q = RegExp(j.source),
            U = /<%-([\s\S]+?)%>/g,
            L = /<%([\s\S]+?)%>/g,
            H = /<%=([\s\S]+?)%>/g,
            F = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            D = /^\w*$/,
            K = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
            W = /[\\^$.*+?()[\]{}|]/g,
            V = RegExp(W.source),
            G = /^\s+|\s+$/g,
            X = /^\s+/,
            $ = /\s+$/,
            J = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
            Z = /\{\n\/\* \[wrapped with (.+)\] \*/,
            Y = /,? & /,
            Q = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
            ee = /\\(\\)?/g,
            te = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
            re = /\w*$/,
            ne = /^[-+]0x[0-9a-f]+$/i,
            ie = /^0b[01]+$/i,
            oe = /^\[object .+?Constructor\]$/,
            ae = /^0o[0-7]+$/i,
            se = /^(?:0|[1-9]\d*)$/,
            ue = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
            ce = /($^)/,
            fe = /['\n\r\u2028\u2029\\]/g,
            le = '\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff',
            de =
              '\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
            he = '[\\ud800-\\udfff]',
            pe = '[' + de + ']',
            me = '[' + le + ']',
            be = '\\d+',
            ge = '[\\u2700-\\u27bf]',
            ve = '[a-z\\xdf-\\xf6\\xf8-\\xff]',
            ye =
              '[^\\ud800-\\udfff' +
              de +
              be +
              '\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]',
            we = '\\ud83c[\\udffb-\\udfff]',
            _e = '[^\\ud800-\\udfff]',
            Se = '(?:\\ud83c[\\udde6-\\uddff]){2}',
            Me = '[\\ud800-\\udbff][\\udc00-\\udfff]',
            Ee = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
            ke = '(?:' + ve + '|' + ye + ')',
            xe = '(?:' + Ee + '|' + ye + ')',
            Te = '(?:' + me + '|' + we + ')' + '?',
            Oe =
              '[\\ufe0e\\ufe0f]?' +
              Te +
              ('(?:\\u200d(?:' +
                [_e, Se, Me].join('|') +
                ')[\\ufe0e\\ufe0f]?' +
                Te +
                ')*'),
            Ie = '(?:' + [ge, Se, Me].join('|') + ')' + Oe,
            Ae = '(?:' + [_e + me + '?', me, Se, Me, he].join('|') + ')',
            Pe = RegExp("['’]", 'g'),
            Ne = RegExp(me, 'g'),
            Be = RegExp(we + '(?=' + we + ')|' + Ae + Oe, 'g'),
            Ce = RegExp(
              [
                Ee +
                  '?' +
                  ve +
                  "+(?:['’](?:d|ll|m|re|s|t|ve))?(?=" +
                  [pe, Ee, '$'].join('|') +
                  ')',
                xe +
                  "+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=" +
                  [pe, Ee + ke, '$'].join('|') +
                  ')',
                Ee + '?' + ke + "+(?:['’](?:d|ll|m|re|s|t|ve))?",
                Ee + "+(?:['’](?:D|LL|M|RE|S|T|VE))?",
                '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
                '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
                be,
                Ie,
              ].join('|'),
              'g'
            ),
            Re = RegExp('[\\u200d\\ud800-\\udfff' + le + '\\ufe0e\\ufe0f]'),
            je = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
            ze = [
              'Array',
              'Buffer',
              'DataView',
              'Date',
              'Error',
              'Float32Array',
              'Float64Array',
              'Function',
              'Int8Array',
              'Int16Array',
              'Int32Array',
              'Map',
              'Math',
              'Object',
              'Promise',
              'RegExp',
              'Set',
              'String',
              'Symbol',
              'TypeError',
              'Uint8Array',
              'Uint8ClampedArray',
              'Uint16Array',
              'Uint32Array',
              'WeakMap',
              '_',
              'clearTimeout',
              'isFinite',
              'parseInt',
              'setTimeout',
            ],
            qe = -1,
            Ue = {};
          (Ue[E] = Ue[k] = Ue[x] = Ue[T] = Ue[O] = Ue[I] = Ue[
            '[object Uint8ClampedArray]'
          ] = Ue[A] = Ue[P] = !0),
            (Ue[s] = Ue[u] = Ue[S] = Ue[c] = Ue[M] = Ue[f] = Ue[l] = Ue[d] = Ue[
              p
            ] = Ue[m] = Ue[b] = Ue[g] = Ue[v] = Ue[y] = Ue[_] = !1);
          var Le = {};
          (Le[s] = Le[u] = Le[S] = Le[M] = Le[c] = Le[f] = Le[E] = Le[k] = Le[
            x
          ] = Le[T] = Le[O] = Le[p] = Le[m] = Le[b] = Le[g] = Le[v] = Le[
            y
          ] = Le[w] = Le[I] = Le['[object Uint8ClampedArray]'] = Le[A] = Le[
            P
          ] = !0),
            (Le[l] = Le[d] = Le[_] = !1);
          var He = {
              '\\': '\\',
              "'": "'",
              '\n': 'n',
              '\r': 'r',
              '\u2028': 'u2028',
              '\u2029': 'u2029',
            },
            Fe = parseFloat,
            De = parseInt,
            Ke =
              'object' == typeof global &&
              global &&
              global.Object === Object &&
              global,
            We =
              'object' == typeof self && self && self.Object === Object && self,
            Ve = Ke || We || Function('return this')(),
            Ge = t && !t.nodeType && t,
            Xe = Ge && 'object' == typeof e && e && !e.nodeType && e,
            $e = Xe && Xe.exports === Ge,
            Je = $e && Ke.process,
            Ze = (function () {
              try {
                var e = Xe && Xe.require && Xe.require('util').types;
                return e || (Je && Je.binding && Je.binding('util'));
              } catch (e) {}
            })(),
            Ye = Ze && Ze.isArrayBuffer,
            Qe = Ze && Ze.isDate,
            et = Ze && Ze.isMap,
            tt = Ze && Ze.isRegExp,
            rt = Ze && Ze.isSet,
            nt = Ze && Ze.isTypedArray;
          function it(e, t, r) {
            switch (r.length) {
              case 0:
                return e.call(t);
              case 1:
                return e.call(t, r[0]);
              case 2:
                return e.call(t, r[0], r[1]);
              case 3:
                return e.call(t, r[0], r[1], r[2]);
            }
            return e.apply(t, r);
          }
          function ot(e, t, r, n) {
            for (var i = -1, o = null == e ? 0 : e.length; ++i < o; ) {
              var a = e[i];
              t(n, a, r(a), e);
            }
            return n;
          }
          function at(e, t) {
            for (
              var r = -1, n = null == e ? 0 : e.length;
              ++r < n && !1 !== t(e[r], r, e);

            );
            return e;
          }
          function st(e, t) {
            for (
              var r = null == e ? 0 : e.length;
              r-- && !1 !== t(e[r], r, e);

            );
            return e;
          }
          function ut(e, t) {
            for (var r = -1, n = null == e ? 0 : e.length; ++r < n; )
              if (!t(e[r], r, e)) return !1;
            return !0;
          }
          function ct(e, t) {
            for (
              var r = -1, n = null == e ? 0 : e.length, i = 0, o = [];
              ++r < n;

            ) {
              var a = e[r];
              t(a, r, e) && (o[i++] = a);
            }
            return o;
          }
          function ft(e, t) {
            return !!(null == e ? 0 : e.length) && wt(e, t, 0) > -1;
          }
          function lt(e, t, r) {
            for (var n = -1, i = null == e ? 0 : e.length; ++n < i; )
              if (r(t, e[n])) return !0;
            return !1;
          }
          function dt(e, t) {
            for (
              var r = -1, n = null == e ? 0 : e.length, i = Array(n);
              ++r < n;

            )
              i[r] = t(e[r], r, e);
            return i;
          }
          function ht(e, t) {
            for (var r = -1, n = t.length, i = e.length; ++r < n; )
              e[i + r] = t[r];
            return e;
          }
          function pt(e, t, r, n) {
            var i = -1,
              o = null == e ? 0 : e.length;
            for (n && o && (r = e[++i]); ++i < o; ) r = t(r, e[i], i, e);
            return r;
          }
          function mt(e, t, r, n) {
            var i = null == e ? 0 : e.length;
            for (n && i && (r = e[--i]); i--; ) r = t(r, e[i], i, e);
            return r;
          }
          function bt(e, t) {
            for (var r = -1, n = null == e ? 0 : e.length; ++r < n; )
              if (t(e[r], r, e)) return !0;
            return !1;
          }
          var gt = Et('length');
          function vt(e, t, r) {
            var n;
            return (
              r(e, function (e, r, i) {
                if (t(e, r, i)) return (n = r), !1;
              }),
              n
            );
          }
          function yt(e, t, r, n) {
            for (var i = e.length, o = r + (n ? 1 : -1); n ? o-- : ++o < i; )
              if (t(e[o], o, e)) return o;
            return -1;
          }
          function wt(e, t, r) {
            return t == t
              ? (function (e, t, r) {
                  var n = r - 1,
                    i = e.length;
                  for (; ++n < i; ) if (e[n] === t) return n;
                  return -1;
                })(e, t, r)
              : yt(e, St, r);
          }
          function _t(e, t, r, n) {
            for (var i = r - 1, o = e.length; ++i < o; )
              if (n(e[i], t)) return i;
            return -1;
          }
          function St(e) {
            return e != e;
          }
          function Mt(e, t) {
            var r = null == e ? 0 : e.length;
            return r ? Tt(e, t) / r : NaN;
          }
          function Et(e) {
            return function (t) {
              return null == t ? void 0 : t[e];
            };
          }
          function kt(e) {
            return function (t) {
              return null == e ? void 0 : e[t];
            };
          }
          function xt(e, t, r, n, i) {
            return (
              i(e, function (e, i, o) {
                r = n ? ((n = !1), e) : t(r, e, i, o);
              }),
              r
            );
          }
          function Tt(e, t) {
            for (var r, n = -1, i = e.length; ++n < i; ) {
              var o = t(e[n]);
              void 0 !== o && (r = void 0 === r ? o : r + o);
            }
            return r;
          }
          function Ot(e, t) {
            for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
            return n;
          }
          function It(e) {
            return function (t) {
              return e(t);
            };
          }
          function At(e, t) {
            return dt(t, function (t) {
              return e[t];
            });
          }
          function Pt(e, t) {
            return e.has(t);
          }
          function Nt(e, t) {
            for (var r = -1, n = e.length; ++r < n && wt(t, e[r], 0) > -1; );
            return r;
          }
          function Bt(e, t) {
            for (var r = e.length; r-- && wt(t, e[r], 0) > -1; );
            return r;
          }
          function Ct(e, t) {
            for (var r = e.length, n = 0; r--; ) e[r] === t && ++n;
            return n;
          }
          var Rt = kt({
              À: 'A',
              Á: 'A',
              Â: 'A',
              Ã: 'A',
              Ä: 'A',
              Å: 'A',
              à: 'a',
              á: 'a',
              â: 'a',
              ã: 'a',
              ä: 'a',
              å: 'a',
              Ç: 'C',
              ç: 'c',
              Ð: 'D',
              ð: 'd',
              È: 'E',
              É: 'E',
              Ê: 'E',
              Ë: 'E',
              è: 'e',
              é: 'e',
              ê: 'e',
              ë: 'e',
              Ì: 'I',
              Í: 'I',
              Î: 'I',
              Ï: 'I',
              ì: 'i',
              í: 'i',
              î: 'i',
              ï: 'i',
              Ñ: 'N',
              ñ: 'n',
              Ò: 'O',
              Ó: 'O',
              Ô: 'O',
              Õ: 'O',
              Ö: 'O',
              Ø: 'O',
              ò: 'o',
              ó: 'o',
              ô: 'o',
              õ: 'o',
              ö: 'o',
              ø: 'o',
              Ù: 'U',
              Ú: 'U',
              Û: 'U',
              Ü: 'U',
              ù: 'u',
              ú: 'u',
              û: 'u',
              ü: 'u',
              Ý: 'Y',
              ý: 'y',
              ÿ: 'y',
              Æ: 'Ae',
              æ: 'ae',
              Þ: 'Th',
              þ: 'th',
              ß: 'ss',
              Ā: 'A',
              Ă: 'A',
              Ą: 'A',
              ā: 'a',
              ă: 'a',
              ą: 'a',
              Ć: 'C',
              Ĉ: 'C',
              Ċ: 'C',
              Č: 'C',
              ć: 'c',
              ĉ: 'c',
              ċ: 'c',
              č: 'c',
              Ď: 'D',
              Đ: 'D',
              ď: 'd',
              đ: 'd',
              Ē: 'E',
              Ĕ: 'E',
              Ė: 'E',
              Ę: 'E',
              Ě: 'E',
              ē: 'e',
              ĕ: 'e',
              ė: 'e',
              ę: 'e',
              ě: 'e',
              Ĝ: 'G',
              Ğ: 'G',
              Ġ: 'G',
              Ģ: 'G',
              ĝ: 'g',
              ğ: 'g',
              ġ: 'g',
              ģ: 'g',
              Ĥ: 'H',
              Ħ: 'H',
              ĥ: 'h',
              ħ: 'h',
              Ĩ: 'I',
              Ī: 'I',
              Ĭ: 'I',
              Į: 'I',
              İ: 'I',
              ĩ: 'i',
              ī: 'i',
              ĭ: 'i',
              į: 'i',
              ı: 'i',
              Ĵ: 'J',
              ĵ: 'j',
              Ķ: 'K',
              ķ: 'k',
              ĸ: 'k',
              Ĺ: 'L',
              Ļ: 'L',
              Ľ: 'L',
              Ŀ: 'L',
              Ł: 'L',
              ĺ: 'l',
              ļ: 'l',
              ľ: 'l',
              ŀ: 'l',
              ł: 'l',
              Ń: 'N',
              Ņ: 'N',
              Ň: 'N',
              Ŋ: 'N',
              ń: 'n',
              ņ: 'n',
              ň: 'n',
              ŋ: 'n',
              Ō: 'O',
              Ŏ: 'O',
              Ő: 'O',
              ō: 'o',
              ŏ: 'o',
              ő: 'o',
              Ŕ: 'R',
              Ŗ: 'R',
              Ř: 'R',
              ŕ: 'r',
              ŗ: 'r',
              ř: 'r',
              Ś: 'S',
              Ŝ: 'S',
              Ş: 'S',
              Š: 'S',
              ś: 's',
              ŝ: 's',
              ş: 's',
              š: 's',
              Ţ: 'T',
              Ť: 'T',
              Ŧ: 'T',
              ţ: 't',
              ť: 't',
              ŧ: 't',
              Ũ: 'U',
              Ū: 'U',
              Ŭ: 'U',
              Ů: 'U',
              Ű: 'U',
              Ų: 'U',
              ũ: 'u',
              ū: 'u',
              ŭ: 'u',
              ů: 'u',
              ű: 'u',
              ų: 'u',
              Ŵ: 'W',
              ŵ: 'w',
              Ŷ: 'Y',
              ŷ: 'y',
              Ÿ: 'Y',
              Ź: 'Z',
              Ż: 'Z',
              Ž: 'Z',
              ź: 'z',
              ż: 'z',
              ž: 'z',
              Ĳ: 'IJ',
              ĳ: 'ij',
              Œ: 'Oe',
              œ: 'oe',
              ŉ: "'n",
              ſ: 's',
            }),
            jt = kt({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;',
            });
          function zt(e) {
            return '\\' + He[e];
          }
          function qt(e) {
            return Re.test(e);
          }
          function Ut(e) {
            var t = -1,
              r = Array(e.size);
            return (
              e.forEach(function (e, n) {
                r[++t] = [n, e];
              }),
              r
            );
          }
          function Lt(e, t) {
            return function (r) {
              return e(t(r));
            };
          }
          function Ht(e, t) {
            for (var r = -1, n = e.length, i = 0, a = []; ++r < n; ) {
              var s = e[r];
              (s !== t && s !== o) || ((e[r] = o), (a[i++] = r));
            }
            return a;
          }
          function Ft(e) {
            var t = -1,
              r = Array(e.size);
            return (
              e.forEach(function (e) {
                r[++t] = e;
              }),
              r
            );
          }
          function Dt(e) {
            var t = -1,
              r = Array(e.size);
            return (
              e.forEach(function (e) {
                r[++t] = [e, e];
              }),
              r
            );
          }
          function Kt(e) {
            return qt(e)
              ? (function (e) {
                  var t = (Be.lastIndex = 0);
                  for (; Be.test(e); ) ++t;
                  return t;
                })(e)
              : gt(e);
          }
          function Wt(e) {
            return qt(e)
              ? (function (e) {
                  return e.match(Be) || [];
                })(e)
              : (function (e) {
                  return e.split('');
                })(e);
          }
          var Vt = kt({
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&#39;': "'",
          });
          var Gt = (function e(t) {
            var r,
              n = (t =
                null == t ? Ve : Gt.defaults(Ve.Object(), t, Gt.pick(Ve, ze)))
                .Array,
              le = t.Date,
              de = t.Error,
              he = t.Function,
              pe = t.Math,
              me = t.Object,
              be = t.RegExp,
              ge = t.String,
              ve = t.TypeError,
              ye = n.prototype,
              we = he.prototype,
              _e = me.prototype,
              Se = t['__core-js_shared__'],
              Me = we.toString,
              Ee = _e.hasOwnProperty,
              ke = 0,
              xe = (r = /[^.]+$/.exec(
                (Se && Se.keys && Se.keys.IE_PROTO) || ''
              ))
                ? 'Symbol(src)_1.' + r
                : '',
              Te = _e.toString,
              Oe = Me.call(me),
              Ie = Ve._,
              Ae = be(
                '^' +
                  Me.call(Ee)
                    .replace(W, '\\$&')
                    .replace(
                      /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                      '$1.*?'
                    ) +
                  '$'
              ),
              Be = $e ? t.Buffer : void 0,
              Re = t.Symbol,
              He = t.Uint8Array,
              Ke = Be ? Be.allocUnsafe : void 0,
              We = Lt(me.getPrototypeOf, me),
              Ge = me.create,
              Xe = _e.propertyIsEnumerable,
              Je = ye.splice,
              Ze = Re ? Re.isConcatSpreadable : void 0,
              gt = Re ? Re.iterator : void 0,
              kt = Re ? Re.toStringTag : void 0,
              Xt = (function () {
                try {
                  var e = Qi(me, 'defineProperty');
                  return e({}, '', {}), e;
                } catch (e) {}
              })(),
              $t = t.clearTimeout !== Ve.clearTimeout && t.clearTimeout,
              Jt = le && le.now !== Ve.Date.now && le.now,
              Zt = t.setTimeout !== Ve.setTimeout && t.setTimeout,
              Yt = pe.ceil,
              Qt = pe.floor,
              er = me.getOwnPropertySymbols,
              tr = Be ? Be.isBuffer : void 0,
              rr = t.isFinite,
              nr = ye.join,
              ir = Lt(me.keys, me),
              or = pe.max,
              ar = pe.min,
              sr = le.now,
              ur = t.parseInt,
              cr = pe.random,
              fr = ye.reverse,
              lr = Qi(t, 'DataView'),
              dr = Qi(t, 'Map'),
              hr = Qi(t, 'Promise'),
              pr = Qi(t, 'Set'),
              mr = Qi(t, 'WeakMap'),
              br = Qi(me, 'create'),
              gr = mr && new mr(),
              vr = {},
              yr = To(lr),
              wr = To(dr),
              _r = To(hr),
              Sr = To(pr),
              Mr = To(mr),
              Er = Re ? Re.prototype : void 0,
              kr = Er ? Er.valueOf : void 0,
              xr = Er ? Er.toString : void 0;
            function Tr(e) {
              if (Ka(e) && !Ba(e) && !(e instanceof Pr)) {
                if (e instanceof Ar) return e;
                if (Ee.call(e, '__wrapped__')) return Oo(e);
              }
              return new Ar(e);
            }
            var Or = (function () {
              function e() {}
              return function (t) {
                if (!Da(t)) return {};
                if (Ge) return Ge(t);
                e.prototype = t;
                var r = new e();
                return (e.prototype = void 0), r;
              };
            })();
            function Ir() {}
            function Ar(e, t) {
              (this.__wrapped__ = e),
                (this.__actions__ = []),
                (this.__chain__ = !!t),
                (this.__index__ = 0),
                (this.__values__ = void 0);
            }
            function Pr(e) {
              (this.__wrapped__ = e),
                (this.__actions__ = []),
                (this.__dir__ = 1),
                (this.__filtered__ = !1),
                (this.__iteratees__ = []),
                (this.__takeCount__ = 4294967295),
                (this.__views__ = []);
            }
            function Nr(e) {
              var t = -1,
                r = null == e ? 0 : e.length;
              for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
              }
            }
            function Br(e) {
              var t = -1,
                r = null == e ? 0 : e.length;
              for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
              }
            }
            function Cr(e) {
              var t = -1,
                r = null == e ? 0 : e.length;
              for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
              }
            }
            function Rr(e) {
              var t = -1,
                r = null == e ? 0 : e.length;
              for (this.__data__ = new Cr(); ++t < r; ) this.add(e[t]);
            }
            function jr(e) {
              var t = (this.__data__ = new Br(e));
              this.size = t.size;
            }
            function zr(e, t) {
              var r = Ba(e),
                n = !r && Na(e),
                i = !r && !n && za(e),
                o = !r && !n && !i && Ya(e),
                a = r || n || i || o,
                s = a ? Ot(e.length, ge) : [],
                u = s.length;
              for (var c in e)
                (!t && !Ee.call(e, c)) ||
                  (a &&
                    ('length' == c ||
                      (i && ('offset' == c || 'parent' == c)) ||
                      (o &&
                        ('buffer' == c ||
                          'byteLength' == c ||
                          'byteOffset' == c)) ||
                      ao(c, u))) ||
                  s.push(c);
              return s;
            }
            function qr(e) {
              var t = e.length;
              return t ? e[jn(0, t - 1)] : void 0;
            }
            function Ur(e, t) {
              return Eo(gi(e), Xr(t, 0, e.length));
            }
            function Lr(e) {
              return Eo(gi(e));
            }
            function Hr(e, t, r) {
              ((void 0 !== r && !Ia(e[t], r)) || (void 0 === r && !(t in e))) &&
                Vr(e, t, r);
            }
            function Fr(e, t, r) {
              var n = e[t];
              (Ee.call(e, t) && Ia(n, r) && (void 0 !== r || t in e)) ||
                Vr(e, t, r);
            }
            function Dr(e, t) {
              for (var r = e.length; r--; ) if (Ia(e[r][0], t)) return r;
              return -1;
            }
            function Kr(e, t, r, n) {
              return (
                Qr(e, function (e, i, o) {
                  t(n, e, r(e), o);
                }),
                n
              );
            }
            function Wr(e, t) {
              return e && vi(t, ws(t), e);
            }
            function Vr(e, t, r) {
              '__proto__' == t && Xt
                ? Xt(e, t, {
                    configurable: !0,
                    enumerable: !0,
                    value: r,
                    writable: !0,
                  })
                : (e[t] = r);
            }
            function Gr(e, t) {
              for (var r = -1, i = t.length, o = n(i), a = null == e; ++r < i; )
                o[r] = a ? void 0 : ms(e, t[r]);
              return o;
            }
            function Xr(e, t, r) {
              return (
                e == e &&
                  (void 0 !== r && (e = e <= r ? e : r),
                  void 0 !== t && (e = e >= t ? e : t)),
                e
              );
            }
            function $r(e, t, r, n, i, o) {
              var a,
                u = 1 & t,
                l = 2 & t,
                _ = 4 & t;
              if ((r && (a = i ? r(e, n, i, o) : r(e)), void 0 !== a)) return a;
              if (!Da(e)) return e;
              var N = Ba(e);
              if (N) {
                if (
                  ((a = (function (e) {
                    var t = e.length,
                      r = new e.constructor(t);
                    t &&
                      'string' == typeof e[0] &&
                      Ee.call(e, 'index') &&
                      ((r.index = e.index), (r.input = e.input));
                    return r;
                  })(e)),
                  !u)
                )
                  return gi(e, a);
              } else {
                var B = ro(e),
                  C = B == d || B == h;
                if (za(e)) return li(e, u);
                if (B == b || B == s || (C && !i)) {
                  if (((a = l || C ? {} : io(e)), !u))
                    return l
                      ? (function (e, t) {
                          return vi(e, to(e), t);
                        })(
                          e,
                          (function (e, t) {
                            return e && vi(t, _s(t), e);
                          })(a, e)
                        )
                      : (function (e, t) {
                          return vi(e, eo(e), t);
                        })(e, Wr(a, e));
                } else {
                  if (!Le[B]) return i ? e : {};
                  a = (function (e, t, r) {
                    var n = e.constructor;
                    switch (t) {
                      case S:
                        return di(e);
                      case c:
                      case f:
                        return new n(+e);
                      case M:
                        return (function (e, t) {
                          var r = t ? di(e.buffer) : e.buffer;
                          return new e.constructor(
                            r,
                            e.byteOffset,
                            e.byteLength
                          );
                        })(e, r);
                      case E:
                      case k:
                      case x:
                      case T:
                      case O:
                      case I:
                      case '[object Uint8ClampedArray]':
                      case A:
                      case P:
                        return hi(e, r);
                      case p:
                        return new n();
                      case m:
                      case y:
                        return new n(e);
                      case g:
                        return (function (e) {
                          var t = new e.constructor(e.source, re.exec(e));
                          return (t.lastIndex = e.lastIndex), t;
                        })(e);
                      case v:
                        return new n();
                      case w:
                        return (i = e), kr ? me(kr.call(i)) : {};
                    }
                    var i;
                  })(e, B, u);
                }
              }
              o || (o = new jr());
              var R = o.get(e);
              if (R) return R;
              o.set(e, a),
                $a(e)
                  ? e.forEach(function (n) {
                      a.add($r(n, t, r, n, e, o));
                    })
                  : Wa(e) &&
                    e.forEach(function (n, i) {
                      a.set(i, $r(n, t, r, i, e, o));
                    });
              var j = N ? void 0 : (_ ? (l ? Vi : Wi) : l ? _s : ws)(e);
              return (
                at(j || e, function (n, i) {
                  j && (n = e[(i = n)]), Fr(a, i, $r(n, t, r, i, e, o));
                }),
                a
              );
            }
            function Jr(e, t, r) {
              var n = r.length;
              if (null == e) return !n;
              for (e = me(e); n--; ) {
                var i = r[n],
                  o = t[i],
                  a = e[i];
                if ((void 0 === a && !(i in e)) || !o(a)) return !1;
              }
              return !0;
            }
            function Zr(e, t, r) {
              if ('function' != typeof e) throw new ve(i);
              return wo(function () {
                e.apply(void 0, r);
              }, t);
            }
            function Yr(e, t, r, n) {
              var i = -1,
                o = ft,
                a = !0,
                s = e.length,
                u = [],
                c = t.length;
              if (!s) return u;
              r && (t = dt(t, It(r))),
                n
                  ? ((o = lt), (a = !1))
                  : t.length >= 200 && ((o = Pt), (a = !1), (t = new Rr(t)));
              e: for (; ++i < s; ) {
                var f = e[i],
                  l = null == r ? f : r(f);
                if (((f = n || 0 !== f ? f : 0), a && l == l)) {
                  for (var d = c; d--; ) if (t[d] === l) continue e;
                  u.push(f);
                } else o(t, l, n) || u.push(f);
              }
              return u;
            }
            (Tr.templateSettings = {
              escape: U,
              evaluate: L,
              interpolate: H,
              variable: '',
              imports: { _: Tr },
            }),
              (Tr.prototype = Ir.prototype),
              (Tr.prototype.constructor = Tr),
              (Ar.prototype = Or(Ir.prototype)),
              (Ar.prototype.constructor = Ar),
              (Pr.prototype = Or(Ir.prototype)),
              (Pr.prototype.constructor = Pr),
              (Nr.prototype.clear = function () {
                (this.__data__ = br ? br(null) : {}), (this.size = 0);
              }),
              (Nr.prototype.delete = function (e) {
                var t = this.has(e) && delete this.__data__[e];
                return (this.size -= t ? 1 : 0), t;
              }),
              (Nr.prototype.get = function (e) {
                var t = this.__data__;
                if (br) {
                  var r = t[e];
                  return '__lodash_hash_undefined__' === r ? void 0 : r;
                }
                return Ee.call(t, e) ? t[e] : void 0;
              }),
              (Nr.prototype.has = function (e) {
                var t = this.__data__;
                return br ? void 0 !== t[e] : Ee.call(t, e);
              }),
              (Nr.prototype.set = function (e, t) {
                var r = this.__data__;
                return (
                  (this.size += this.has(e) ? 0 : 1),
                  (r[e] = br && void 0 === t ? '__lodash_hash_undefined__' : t),
                  this
                );
              }),
              (Br.prototype.clear = function () {
                (this.__data__ = []), (this.size = 0);
              }),
              (Br.prototype.delete = function (e) {
                var t = this.__data__,
                  r = Dr(t, e);
                return (
                  !(r < 0) &&
                  (r == t.length - 1 ? t.pop() : Je.call(t, r, 1),
                  --this.size,
                  !0)
                );
              }),
              (Br.prototype.get = function (e) {
                var t = this.__data__,
                  r = Dr(t, e);
                return r < 0 ? void 0 : t[r][1];
              }),
              (Br.prototype.has = function (e) {
                return Dr(this.__data__, e) > -1;
              }),
              (Br.prototype.set = function (e, t) {
                var r = this.__data__,
                  n = Dr(r, e);
                return (
                  n < 0 ? (++this.size, r.push([e, t])) : (r[n][1] = t), this
                );
              }),
              (Cr.prototype.clear = function () {
                (this.size = 0),
                  (this.__data__ = {
                    hash: new Nr(),
                    map: new (dr || Br)(),
                    string: new Nr(),
                  });
              }),
              (Cr.prototype.delete = function (e) {
                var t = Zi(this, e).delete(e);
                return (this.size -= t ? 1 : 0), t;
              }),
              (Cr.prototype.get = function (e) {
                return Zi(this, e).get(e);
              }),
              (Cr.prototype.has = function (e) {
                return Zi(this, e).has(e);
              }),
              (Cr.prototype.set = function (e, t) {
                var r = Zi(this, e),
                  n = r.size;
                return r.set(e, t), (this.size += r.size == n ? 0 : 1), this;
              }),
              (Rr.prototype.add = Rr.prototype.push = function (e) {
                return this.__data__.set(e, '__lodash_hash_undefined__'), this;
              }),
              (Rr.prototype.has = function (e) {
                return this.__data__.has(e);
              }),
              (jr.prototype.clear = function () {
                (this.__data__ = new Br()), (this.size = 0);
              }),
              (jr.prototype.delete = function (e) {
                var t = this.__data__,
                  r = t.delete(e);
                return (this.size = t.size), r;
              }),
              (jr.prototype.get = function (e) {
                return this.__data__.get(e);
              }),
              (jr.prototype.has = function (e) {
                return this.__data__.has(e);
              }),
              (jr.prototype.set = function (e, t) {
                var r = this.__data__;
                if (r instanceof Br) {
                  var n = r.__data__;
                  if (!dr || n.length < 199)
                    return n.push([e, t]), (this.size = ++r.size), this;
                  r = this.__data__ = new Cr(n);
                }
                return r.set(e, t), (this.size = r.size), this;
              });
            var Qr = _i(un),
              en = _i(cn, !0);
            function tn(e, t) {
              var r = !0;
              return (
                Qr(e, function (e, n, i) {
                  return (r = !!t(e, n, i));
                }),
                r
              );
            }
            function rn(e, t, r) {
              for (var n = -1, i = e.length; ++n < i; ) {
                var o = e[n],
                  a = t(o);
                if (null != a && (void 0 === s ? a == a && !Za(a) : r(a, s)))
                  var s = a,
                    u = o;
              }
              return u;
            }
            function nn(e, t) {
              var r = [];
              return (
                Qr(e, function (e, n, i) {
                  t(e, n, i) && r.push(e);
                }),
                r
              );
            }
            function on(e, t, r, n, i) {
              var o = -1,
                a = e.length;
              for (r || (r = oo), i || (i = []); ++o < a; ) {
                var s = e[o];
                t > 0 && r(s)
                  ? t > 1
                    ? on(s, t - 1, r, n, i)
                    : ht(i, s)
                  : n || (i[i.length] = s);
              }
              return i;
            }
            var an = Si(),
              sn = Si(!0);
            function un(e, t) {
              return e && an(e, t, ws);
            }
            function cn(e, t) {
              return e && sn(e, t, ws);
            }
            function fn(e, t) {
              return ct(t, function (t) {
                return La(e[t]);
              });
            }
            function ln(e, t) {
              for (var r = 0, n = (t = si(t, e)).length; null != e && r < n; )
                e = e[xo(t[r++])];
              return r && r == n ? e : void 0;
            }
            function dn(e, t, r) {
              var n = t(e);
              return Ba(e) ? n : ht(n, r(e));
            }
            function hn(e) {
              return null == e
                ? void 0 === e
                  ? '[object Undefined]'
                  : '[object Null]'
                : kt && kt in me(e)
                ? (function (e) {
                    var t = Ee.call(e, kt),
                      r = e[kt];
                    try {
                      e[kt] = void 0;
                      var n = !0;
                    } catch (e) {}
                    var i = Te.call(e);
                    n && (t ? (e[kt] = r) : delete e[kt]);
                    return i;
                  })(e)
                : (function (e) {
                    return Te.call(e);
                  })(e);
            }
            function pn(e, t) {
              return e > t;
            }
            function mn(e, t) {
              return null != e && Ee.call(e, t);
            }
            function bn(e, t) {
              return null != e && t in me(e);
            }
            function gn(e, t, r) {
              for (
                var i = r ? lt : ft,
                  o = e[0].length,
                  a = e.length,
                  s = a,
                  u = n(a),
                  c = 1 / 0,
                  f = [];
                s--;

              ) {
                var l = e[s];
                s && t && (l = dt(l, It(t))),
                  (c = ar(l.length, c)),
                  (u[s] =
                    !r && (t || (o >= 120 && l.length >= 120))
                      ? new Rr(s && l)
                      : void 0);
              }
              l = e[0];
              var d = -1,
                h = u[0];
              e: for (; ++d < o && f.length < c; ) {
                var p = l[d],
                  m = t ? t(p) : p;
                if (
                  ((p = r || 0 !== p ? p : 0), !(h ? Pt(h, m) : i(f, m, r)))
                ) {
                  for (s = a; --s; ) {
                    var b = u[s];
                    if (!(b ? Pt(b, m) : i(e[s], m, r))) continue e;
                  }
                  h && h.push(m), f.push(p);
                }
              }
              return f;
            }
            function vn(e, t, r) {
              var n = null == (e = bo(e, (t = si(t, e)))) ? e : e[xo(Uo(t))];
              return null == n ? void 0 : it(n, e, r);
            }
            function yn(e) {
              return Ka(e) && hn(e) == s;
            }
            function wn(e, t, r, n, i) {
              return (
                e === t ||
                (null == e || null == t || (!Ka(e) && !Ka(t))
                  ? e != e && t != t
                  : (function (e, t, r, n, i, o) {
                      var a = Ba(e),
                        d = Ba(t),
                        h = a ? u : ro(e),
                        _ = d ? u : ro(t),
                        E = (h = h == s ? b : h) == b,
                        k = (_ = _ == s ? b : _) == b,
                        x = h == _;
                      if (x && za(e)) {
                        if (!za(t)) return !1;
                        (a = !0), (E = !1);
                      }
                      if (x && !E)
                        return (
                          o || (o = new jr()),
                          a || Ya(e)
                            ? Di(e, t, r, n, i, o)
                            : (function (e, t, r, n, i, o, a) {
                                switch (r) {
                                  case M:
                                    if (
                                      e.byteLength != t.byteLength ||
                                      e.byteOffset != t.byteOffset
                                    )
                                      return !1;
                                    (e = e.buffer), (t = t.buffer);
                                  case S:
                                    return !(
                                      e.byteLength != t.byteLength ||
                                      !o(new He(e), new He(t))
                                    );
                                  case c:
                                  case f:
                                  case m:
                                    return Ia(+e, +t);
                                  case l:
                                    return (
                                      e.name == t.name && e.message == t.message
                                    );
                                  case g:
                                  case y:
                                    return e == t + '';
                                  case p:
                                    var s = Ut;
                                  case v:
                                    var u = 1 & n;
                                    if ((s || (s = Ft), e.size != t.size && !u))
                                      return !1;
                                    var d = a.get(e);
                                    if (d) return d == t;
                                    (n |= 2), a.set(e, t);
                                    var h = Di(s(e), s(t), n, i, o, a);
                                    return a.delete(e), h;
                                  case w:
                                    if (kr) return kr.call(e) == kr.call(t);
                                }
                                return !1;
                              })(e, t, h, r, n, i, o)
                        );
                      if (!(1 & r)) {
                        var T = E && Ee.call(e, '__wrapped__'),
                          O = k && Ee.call(t, '__wrapped__');
                        if (T || O) {
                          var I = T ? e.value() : e,
                            A = O ? t.value() : t;
                          return o || (o = new jr()), i(I, A, r, n, o);
                        }
                      }
                      if (!x) return !1;
                      return (
                        o || (o = new jr()),
                        (function (e, t, r, n, i, o) {
                          var a = 1 & r,
                            s = Wi(e),
                            u = s.length,
                            c = Wi(t).length;
                          if (u != c && !a) return !1;
                          var f = u;
                          for (; f--; ) {
                            var l = s[f];
                            if (!(a ? l in t : Ee.call(t, l))) return !1;
                          }
                          var d = o.get(e);
                          if (d && o.get(t)) return d == t;
                          var h = !0;
                          o.set(e, t), o.set(t, e);
                          var p = a;
                          for (; ++f < u; ) {
                            l = s[f];
                            var m = e[l],
                              b = t[l];
                            if (n)
                              var g = a
                                ? n(b, m, l, t, e, o)
                                : n(m, b, l, e, t, o);
                            if (
                              !(void 0 === g ? m === b || i(m, b, r, n, o) : g)
                            ) {
                              h = !1;
                              break;
                            }
                            p || (p = 'constructor' == l);
                          }
                          if (h && !p) {
                            var v = e.constructor,
                              y = t.constructor;
                            v == y ||
                              !('constructor' in e) ||
                              !('constructor' in t) ||
                              ('function' == typeof v &&
                                v instanceof v &&
                                'function' == typeof y &&
                                y instanceof y) ||
                              (h = !1);
                          }
                          return o.delete(e), o.delete(t), h;
                        })(e, t, r, n, i, o)
                      );
                    })(e, t, r, n, wn, i))
              );
            }
            function _n(e, t, r, n) {
              var i = r.length,
                o = i,
                a = !n;
              if (null == e) return !o;
              for (e = me(e); i--; ) {
                var s = r[i];
                if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
              }
              for (; ++i < o; ) {
                var u = (s = r[i])[0],
                  c = e[u],
                  f = s[1];
                if (a && s[2]) {
                  if (void 0 === c && !(u in e)) return !1;
                } else {
                  var l = new jr();
                  if (n) var d = n(c, f, u, e, t, l);
                  if (!(void 0 === d ? wn(f, c, 3, n, l) : d)) return !1;
                }
              }
              return !0;
            }
            function Sn(e) {
              return (
                !(!Da(e) || ((t = e), xe && xe in t)) &&
                (La(e) ? Ae : oe).test(To(e))
              );
              var t;
            }
            function Mn(e) {
              return 'function' == typeof e
                ? e
                : null == e
                ? Vs
                : 'object' == typeof e
                ? Ba(e)
                  ? In(e[0], e[1])
                  : On(e)
                : tu(e);
            }
            function En(e) {
              if (!lo(e)) return ir(e);
              var t = [];
              for (var r in me(e))
                Ee.call(e, r) && 'constructor' != r && t.push(r);
              return t;
            }
            function kn(e) {
              if (!Da(e))
                return (function (e) {
                  var t = [];
                  if (null != e) for (var r in me(e)) t.push(r);
                  return t;
                })(e);
              var t = lo(e),
                r = [];
              for (var n in e)
                ('constructor' != n || (!t && Ee.call(e, n))) && r.push(n);
              return r;
            }
            function xn(e, t) {
              return e < t;
            }
            function Tn(e, t) {
              var r = -1,
                i = Ra(e) ? n(e.length) : [];
              return (
                Qr(e, function (e, n, o) {
                  i[++r] = t(e, n, o);
                }),
                i
              );
            }
            function On(e) {
              var t = Yi(e);
              return 1 == t.length && t[0][2]
                ? po(t[0][0], t[0][1])
                : function (r) {
                    return r === e || _n(r, e, t);
                  };
            }
            function In(e, t) {
              return uo(e) && ho(t)
                ? po(xo(e), t)
                : function (r) {
                    var n = ms(r, e);
                    return void 0 === n && n === t ? bs(r, e) : wn(t, n, 3);
                  };
            }
            function An(e, t, r, n, i) {
              e !== t &&
                an(
                  t,
                  function (o, a) {
                    if ((i || (i = new jr()), Da(o)))
                      !(function (e, t, r, n, i, o, a) {
                        var s = vo(e, r),
                          u = vo(t, r),
                          c = a.get(u);
                        if (c) return void Hr(e, r, c);
                        var f = o ? o(s, u, r + '', e, t, a) : void 0,
                          l = void 0 === f;
                        if (l) {
                          var d = Ba(u),
                            h = !d && za(u),
                            p = !d && !h && Ya(u);
                          (f = u),
                            d || h || p
                              ? Ba(s)
                                ? (f = s)
                                : ja(s)
                                ? (f = gi(s))
                                : h
                                ? ((l = !1), (f = li(u, !0)))
                                : p
                                ? ((l = !1), (f = hi(u, !0)))
                                : (f = [])
                              : Ga(u) || Na(u)
                              ? ((f = s),
                                Na(s)
                                  ? (f = as(s))
                                  : (Da(s) && !La(s)) || (f = io(u)))
                              : (l = !1);
                        }
                        l && (a.set(u, f), i(f, u, n, o, a), a.delete(u));
                        Hr(e, r, f);
                      })(e, t, a, r, An, n, i);
                    else {
                      var s = n ? n(vo(e, a), o, a + '', e, t, i) : void 0;
                      void 0 === s && (s = o), Hr(e, a, s);
                    }
                  },
                  _s
                );
            }
            function Pn(e, t) {
              var r = e.length;
              if (r) return ao((t += t < 0 ? r : 0), r) ? e[t] : void 0;
            }
            function Nn(e, t, r) {
              var n = -1;
              return (
                (t = dt(t.length ? t : [Vs], It(Ji()))),
                (function (e, t) {
                  var r = e.length;
                  for (e.sort(t); r--; ) e[r] = e[r].value;
                  return e;
                })(
                  Tn(e, function (e, r, i) {
                    return {
                      criteria: dt(t, function (t) {
                        return t(e);
                      }),
                      index: ++n,
                      value: e,
                    };
                  }),
                  function (e, t) {
                    return (function (e, t, r) {
                      var n = -1,
                        i = e.criteria,
                        o = t.criteria,
                        a = i.length,
                        s = r.length;
                      for (; ++n < a; ) {
                        var u = pi(i[n], o[n]);
                        if (u) {
                          if (n >= s) return u;
                          var c = r[n];
                          return u * ('desc' == c ? -1 : 1);
                        }
                      }
                      return e.index - t.index;
                    })(e, t, r);
                  }
                )
              );
            }
            function Bn(e, t, r) {
              for (var n = -1, i = t.length, o = {}; ++n < i; ) {
                var a = t[n],
                  s = ln(e, a);
                r(s, a) && Hn(o, si(a, e), s);
              }
              return o;
            }
            function Cn(e, t, r, n) {
              var i = n ? _t : wt,
                o = -1,
                a = t.length,
                s = e;
              for (e === t && (t = gi(t)), r && (s = dt(e, It(r))); ++o < a; )
                for (
                  var u = 0, c = t[o], f = r ? r(c) : c;
                  (u = i(s, f, u, n)) > -1;

                )
                  s !== e && Je.call(s, u, 1), Je.call(e, u, 1);
              return e;
            }
            function Rn(e, t) {
              for (var r = e ? t.length : 0, n = r - 1; r--; ) {
                var i = t[r];
                if (r == n || i !== o) {
                  var o = i;
                  ao(i) ? Je.call(e, i, 1) : Qn(e, i);
                }
              }
              return e;
            }
            function jn(e, t) {
              return e + Qt(cr() * (t - e + 1));
            }
            function zn(e, t) {
              var r = '';
              if (!e || t < 1 || t > 9007199254740991) return r;
              do {
                t % 2 && (r += e), (t = Qt(t / 2)) && (e += e);
              } while (t);
              return r;
            }
            function qn(e, t) {
              return _o(mo(e, t, Vs), e + '');
            }
            function Un(e) {
              return qr(Is(e));
            }
            function Ln(e, t) {
              var r = Is(e);
              return Eo(r, Xr(t, 0, r.length));
            }
            function Hn(e, t, r, n) {
              if (!Da(e)) return e;
              for (
                var i = -1, o = (t = si(t, e)).length, a = o - 1, s = e;
                null != s && ++i < o;

              ) {
                var u = xo(t[i]),
                  c = r;
                if (i != a) {
                  var f = s[u];
                  void 0 === (c = n ? n(f, u, s) : void 0) &&
                    (c = Da(f) ? f : ao(t[i + 1]) ? [] : {});
                }
                Fr(s, u, c), (s = s[u]);
              }
              return e;
            }
            var Fn = gr
                ? function (e, t) {
                    return gr.set(e, t), e;
                  }
                : Vs,
              Dn = Xt
                ? function (e, t) {
                    return Xt(e, 'toString', {
                      configurable: !0,
                      enumerable: !1,
                      value: Ds(t),
                      writable: !0,
                    });
                  }
                : Vs;
            function Kn(e) {
              return Eo(Is(e));
            }
            function Wn(e, t, r) {
              var i = -1,
                o = e.length;
              t < 0 && (t = -t > o ? 0 : o + t),
                (r = r > o ? o : r) < 0 && (r += o),
                (o = t > r ? 0 : (r - t) >>> 0),
                (t >>>= 0);
              for (var a = n(o); ++i < o; ) a[i] = e[i + t];
              return a;
            }
            function Vn(e, t) {
              var r;
              return (
                Qr(e, function (e, n, i) {
                  return !(r = t(e, n, i));
                }),
                !!r
              );
            }
            function Gn(e, t, r) {
              var n = 0,
                i = null == e ? n : e.length;
              if ('number' == typeof t && t == t && i <= 2147483647) {
                for (; n < i; ) {
                  var o = (n + i) >>> 1,
                    a = e[o];
                  null !== a && !Za(a) && (r ? a <= t : a < t)
                    ? (n = o + 1)
                    : (i = o);
                }
                return i;
              }
              return Xn(e, t, Vs, r);
            }
            function Xn(e, t, r, n) {
              t = r(t);
              for (
                var i = 0,
                  o = null == e ? 0 : e.length,
                  a = t != t,
                  s = null === t,
                  u = Za(t),
                  c = void 0 === t;
                i < o;

              ) {
                var f = Qt((i + o) / 2),
                  l = r(e[f]),
                  d = void 0 !== l,
                  h = null === l,
                  p = l == l,
                  m = Za(l);
                if (a) var b = n || p;
                else
                  b = c
                    ? p && (n || d)
                    : s
                    ? p && d && (n || !h)
                    : u
                    ? p && d && !h && (n || !m)
                    : !h && !m && (n ? l <= t : l < t);
                b ? (i = f + 1) : (o = f);
              }
              return ar(o, 4294967294);
            }
            function $n(e, t) {
              for (var r = -1, n = e.length, i = 0, o = []; ++r < n; ) {
                var a = e[r],
                  s = t ? t(a) : a;
                if (!r || !Ia(s, u)) {
                  var u = s;
                  o[i++] = 0 === a ? 0 : a;
                }
              }
              return o;
            }
            function Jn(e) {
              return 'number' == typeof e ? e : Za(e) ? NaN : +e;
            }
            function Zn(e) {
              if ('string' == typeof e) return e;
              if (Ba(e)) return dt(e, Zn) + '';
              if (Za(e)) return xr ? xr.call(e) : '';
              var t = e + '';
              return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
            }
            function Yn(e, t, r) {
              var n = -1,
                i = ft,
                o = e.length,
                a = !0,
                s = [],
                u = s;
              if (r) (a = !1), (i = lt);
              else if (o >= 200) {
                var c = t ? null : zi(e);
                if (c) return Ft(c);
                (a = !1), (i = Pt), (u = new Rr());
              } else u = t ? [] : s;
              e: for (; ++n < o; ) {
                var f = e[n],
                  l = t ? t(f) : f;
                if (((f = r || 0 !== f ? f : 0), a && l == l)) {
                  for (var d = u.length; d--; ) if (u[d] === l) continue e;
                  t && u.push(l), s.push(f);
                } else i(u, l, r) || (u !== s && u.push(l), s.push(f));
              }
              return s;
            }
            function Qn(e, t) {
              return null == (e = bo(e, (t = si(t, e)))) || delete e[xo(Uo(t))];
            }
            function ei(e, t, r, n) {
              return Hn(e, t, r(ln(e, t)), n);
            }
            function ti(e, t, r, n) {
              for (
                var i = e.length, o = n ? i : -1;
                (n ? o-- : ++o < i) && t(e[o], o, e);

              );
              return r
                ? Wn(e, n ? 0 : o, n ? o + 1 : i)
                : Wn(e, n ? o + 1 : 0, n ? i : o);
            }
            function ri(e, t) {
              var r = e;
              return (
                r instanceof Pr && (r = r.value()),
                pt(
                  t,
                  function (e, t) {
                    return t.func.apply(t.thisArg, ht([e], t.args));
                  },
                  r
                )
              );
            }
            function ni(e, t, r) {
              var i = e.length;
              if (i < 2) return i ? Yn(e[0]) : [];
              for (var o = -1, a = n(i); ++o < i; )
                for (var s = e[o], u = -1; ++u < i; )
                  u != o && (a[o] = Yr(a[o] || s, e[u], t, r));
              return Yn(on(a, 1), t, r);
            }
            function ii(e, t, r) {
              for (var n = -1, i = e.length, o = t.length, a = {}; ++n < i; ) {
                var s = n < o ? t[n] : void 0;
                r(a, e[n], s);
              }
              return a;
            }
            function oi(e) {
              return ja(e) ? e : [];
            }
            function ai(e) {
              return 'function' == typeof e ? e : Vs;
            }
            function si(e, t) {
              return Ba(e) ? e : uo(e, t) ? [e] : ko(ss(e));
            }
            var ui = qn;
            function ci(e, t, r) {
              var n = e.length;
              return (r = void 0 === r ? n : r), !t && r >= n ? e : Wn(e, t, r);
            }
            var fi =
              $t ||
              function (e) {
                return Ve.clearTimeout(e);
              };
            function li(e, t) {
              if (t) return e.slice();
              var r = e.length,
                n = Ke ? Ke(r) : new e.constructor(r);
              return e.copy(n), n;
            }
            function di(e) {
              var t = new e.constructor(e.byteLength);
              return new He(t).set(new He(e)), t;
            }
            function hi(e, t) {
              var r = t ? di(e.buffer) : e.buffer;
              return new e.constructor(r, e.byteOffset, e.length);
            }
            function pi(e, t) {
              if (e !== t) {
                var r = void 0 !== e,
                  n = null === e,
                  i = e == e,
                  o = Za(e),
                  a = void 0 !== t,
                  s = null === t,
                  u = t == t,
                  c = Za(t);
                if (
                  (!s && !c && !o && e > t) ||
                  (o && a && u && !s && !c) ||
                  (n && a && u) ||
                  (!r && u) ||
                  !i
                )
                  return 1;
                if (
                  (!n && !o && !c && e < t) ||
                  (c && r && i && !n && !o) ||
                  (s && r && i) ||
                  (!a && i) ||
                  !u
                )
                  return -1;
              }
              return 0;
            }
            function mi(e, t, r, i) {
              for (
                var o = -1,
                  a = e.length,
                  s = r.length,
                  u = -1,
                  c = t.length,
                  f = or(a - s, 0),
                  l = n(c + f),
                  d = !i;
                ++u < c;

              )
                l[u] = t[u];
              for (; ++o < s; ) (d || o < a) && (l[r[o]] = e[o]);
              for (; f--; ) l[u++] = e[o++];
              return l;
            }
            function bi(e, t, r, i) {
              for (
                var o = -1,
                  a = e.length,
                  s = -1,
                  u = r.length,
                  c = -1,
                  f = t.length,
                  l = or(a - u, 0),
                  d = n(l + f),
                  h = !i;
                ++o < l;

              )
                d[o] = e[o];
              for (var p = o; ++c < f; ) d[p + c] = t[c];
              for (; ++s < u; ) (h || o < a) && (d[p + r[s]] = e[o++]);
              return d;
            }
            function gi(e, t) {
              var r = -1,
                i = e.length;
              for (t || (t = n(i)); ++r < i; ) t[r] = e[r];
              return t;
            }
            function vi(e, t, r, n) {
              var i = !r;
              r || (r = {});
              for (var o = -1, a = t.length; ++o < a; ) {
                var s = t[o],
                  u = n ? n(r[s], e[s], s, r, e) : void 0;
                void 0 === u && (u = e[s]), i ? Vr(r, s, u) : Fr(r, s, u);
              }
              return r;
            }
            function yi(e, t) {
              return function (r, n) {
                var i = Ba(r) ? ot : Kr,
                  o = t ? t() : {};
                return i(r, e, Ji(n, 2), o);
              };
            }
            function wi(e) {
              return qn(function (t, r) {
                var n = -1,
                  i = r.length,
                  o = i > 1 ? r[i - 1] : void 0,
                  a = i > 2 ? r[2] : void 0;
                for (
                  o =
                    e.length > 3 && 'function' == typeof o ? (i--, o) : void 0,
                    a &&
                      so(r[0], r[1], a) &&
                      ((o = i < 3 ? void 0 : o), (i = 1)),
                    t = me(t);
                  ++n < i;

                ) {
                  var s = r[n];
                  s && e(t, s, n, o);
                }
                return t;
              });
            }
            function _i(e, t) {
              return function (r, n) {
                if (null == r) return r;
                if (!Ra(r)) return e(r, n);
                for (
                  var i = r.length, o = t ? i : -1, a = me(r);
                  (t ? o-- : ++o < i) && !1 !== n(a[o], o, a);

                );
                return r;
              };
            }
            function Si(e) {
              return function (t, r, n) {
                for (var i = -1, o = me(t), a = n(t), s = a.length; s--; ) {
                  var u = a[e ? s : ++i];
                  if (!1 === r(o[u], u, o)) break;
                }
                return t;
              };
            }
            function Mi(e) {
              return function (t) {
                var r = qt((t = ss(t))) ? Wt(t) : void 0,
                  n = r ? r[0] : t.charAt(0),
                  i = r ? ci(r, 1).join('') : t.slice(1);
                return n[e]() + i;
              };
            }
            function Ei(e) {
              return function (t) {
                return pt(Ls(Ns(t).replace(Pe, '')), e, '');
              };
            }
            function ki(e) {
              return function () {
                var t = arguments;
                switch (t.length) {
                  case 0:
                    return new e();
                  case 1:
                    return new e(t[0]);
                  case 2:
                    return new e(t[0], t[1]);
                  case 3:
                    return new e(t[0], t[1], t[2]);
                  case 4:
                    return new e(t[0], t[1], t[2], t[3]);
                  case 5:
                    return new e(t[0], t[1], t[2], t[3], t[4]);
                  case 6:
                    return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                  case 7:
                    return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
                }
                var r = Or(e.prototype),
                  n = e.apply(r, t);
                return Da(n) ? n : r;
              };
            }
            function xi(e) {
              return function (t, r, n) {
                var i = me(t);
                if (!Ra(t)) {
                  var o = Ji(r, 3);
                  (t = ws(t)),
                    (r = function (e) {
                      return o(i[e], e, i);
                    });
                }
                var a = e(t, r, n);
                return a > -1 ? i[o ? t[a] : a] : void 0;
              };
            }
            function Ti(e) {
              return Ki(function (t) {
                var r = t.length,
                  n = r,
                  o = Ar.prototype.thru;
                for (e && t.reverse(); n--; ) {
                  var a = t[n];
                  if ('function' != typeof a) throw new ve(i);
                  if (o && !s && 'wrapper' == Xi(a)) var s = new Ar([], !0);
                }
                for (n = s ? n : r; ++n < r; ) {
                  var u = Xi((a = t[n])),
                    c = 'wrapper' == u ? Gi(a) : void 0;
                  s =
                    c && co(c[0]) && 424 == c[1] && !c[4].length && 1 == c[9]
                      ? s[Xi(c[0])].apply(s, c[3])
                      : 1 == a.length && co(a)
                      ? s[u]()
                      : s.thru(a);
                }
                return function () {
                  var e = arguments,
                    n = e[0];
                  if (s && 1 == e.length && Ba(n)) return s.plant(n).value();
                  for (var i = 0, o = r ? t[i].apply(this, e) : n; ++i < r; )
                    o = t[i].call(this, o);
                  return o;
                };
              });
            }
            function Oi(e, t, r, i, o, a, s, u, c, f) {
              var l = 128 & t,
                d = 1 & t,
                h = 2 & t,
                p = 24 & t,
                m = 512 & t,
                b = h ? void 0 : ki(e);
              return function g() {
                for (var v = arguments.length, y = n(v), w = v; w--; )
                  y[w] = arguments[w];
                if (p)
                  var _ = $i(g),
                    S = Ct(y, _);
                if (
                  (i && (y = mi(y, i, o, p)),
                  a && (y = bi(y, a, s, p)),
                  (v -= S),
                  p && v < f)
                ) {
                  var M = Ht(y, _);
                  return Ri(e, t, Oi, g.placeholder, r, y, M, u, c, f - v);
                }
                var E = d ? r : this,
                  k = h ? E[e] : e;
                return (
                  (v = y.length),
                  u ? (y = go(y, u)) : m && v > 1 && y.reverse(),
                  l && c < v && (y.length = c),
                  this && this !== Ve && this instanceof g && (k = b || ki(k)),
                  k.apply(E, y)
                );
              };
            }
            function Ii(e, t) {
              return function (r, n) {
                return (function (e, t, r, n) {
                  return (
                    un(e, function (e, i, o) {
                      t(n, r(e), i, o);
                    }),
                    n
                  );
                })(r, e, t(n), {});
              };
            }
            function Ai(e, t) {
              return function (r, n) {
                var i;
                if (void 0 === r && void 0 === n) return t;
                if ((void 0 !== r && (i = r), void 0 !== n)) {
                  if (void 0 === i) return n;
                  'string' == typeof r || 'string' == typeof n
                    ? ((r = Zn(r)), (n = Zn(n)))
                    : ((r = Jn(r)), (n = Jn(n))),
                    (i = e(r, n));
                }
                return i;
              };
            }
            function Pi(e) {
              return Ki(function (t) {
                return (
                  (t = dt(t, It(Ji()))),
                  qn(function (r) {
                    var n = this;
                    return e(t, function (e) {
                      return it(e, n, r);
                    });
                  })
                );
              });
            }
            function Ni(e, t) {
              var r = (t = void 0 === t ? ' ' : Zn(t)).length;
              if (r < 2) return r ? zn(t, e) : t;
              var n = zn(t, Yt(e / Kt(t)));
              return qt(t) ? ci(Wt(n), 0, e).join('') : n.slice(0, e);
            }
            function Bi(e) {
              return function (t, r, i) {
                return (
                  i && 'number' != typeof i && so(t, r, i) && (r = i = void 0),
                  (t = rs(t)),
                  void 0 === r ? ((r = t), (t = 0)) : (r = rs(r)),
                  (function (e, t, r, i) {
                    for (
                      var o = -1, a = or(Yt((t - e) / (r || 1)), 0), s = n(a);
                      a--;

                    )
                      (s[i ? a : ++o] = e), (e += r);
                    return s;
                  })(t, r, (i = void 0 === i ? (t < r ? 1 : -1) : rs(i)), e)
                );
              };
            }
            function Ci(e) {
              return function (t, r) {
                return (
                  ('string' == typeof t && 'string' == typeof r) ||
                    ((t = os(t)), (r = os(r))),
                  e(t, r)
                );
              };
            }
            function Ri(e, t, r, n, i, o, a, s, u, c) {
              var f = 8 & t;
              (t |= f ? 32 : 64), 4 & (t &= ~(f ? 64 : 32)) || (t &= -4);
              var l = [
                  e,
                  t,
                  i,
                  f ? o : void 0,
                  f ? a : void 0,
                  f ? void 0 : o,
                  f ? void 0 : a,
                  s,
                  u,
                  c,
                ],
                d = r.apply(void 0, l);
              return co(e) && yo(d, l), (d.placeholder = n), So(d, e, t);
            }
            function ji(e) {
              var t = pe[e];
              return function (e, r) {
                if (
                  ((e = os(e)), (r = null == r ? 0 : ar(ns(r), 292)) && rr(e))
                ) {
                  var n = (ss(e) + 'e').split('e');
                  return +(
                    (n = (ss(t(n[0] + 'e' + (+n[1] + r))) + 'e').split(
                      'e'
                    ))[0] +
                    'e' +
                    (+n[1] - r)
                  );
                }
                return t(e);
              };
            }
            var zi =
              pr && 1 / Ft(new pr([, -0]))[1] == 1 / 0
                ? function (e) {
                    return new pr(e);
                  }
                : Zs;
            function qi(e) {
              return function (t) {
                var r = ro(t);
                return r == p
                  ? Ut(t)
                  : r == v
                  ? Dt(t)
                  : (function (e, t) {
                      return dt(t, function (t) {
                        return [t, e[t]];
                      });
                    })(t, e(t));
              };
            }
            function Ui(e, t, r, a, s, u, c, f) {
              var l = 2 & t;
              if (!l && 'function' != typeof e) throw new ve(i);
              var d = a ? a.length : 0;
              if (
                (d || ((t &= -97), (a = s = void 0)),
                (c = void 0 === c ? c : or(ns(c), 0)),
                (f = void 0 === f ? f : ns(f)),
                (d -= s ? s.length : 0),
                64 & t)
              ) {
                var h = a,
                  p = s;
                a = s = void 0;
              }
              var m = l ? void 0 : Gi(e),
                b = [e, t, r, a, s, h, p, u, c, f];
              if (
                (m &&
                  (function (e, t) {
                    var r = e[1],
                      n = t[1],
                      i = r | n,
                      a = i < 131,
                      s =
                        (128 == n && 8 == r) ||
                        (128 == n && 256 == r && e[7].length <= t[8]) ||
                        (384 == n && t[7].length <= t[8] && 8 == r);
                    if (!a && !s) return e;
                    1 & n && ((e[2] = t[2]), (i |= 1 & r ? 0 : 4));
                    var u = t[3];
                    if (u) {
                      var c = e[3];
                      (e[3] = c ? mi(c, u, t[4]) : u),
                        (e[4] = c ? Ht(e[3], o) : t[4]);
                    }
                    (u = t[5]) &&
                      ((c = e[5]),
                      (e[5] = c ? bi(c, u, t[6]) : u),
                      (e[6] = c ? Ht(e[5], o) : t[6]));
                    (u = t[7]) && (e[7] = u);
                    128 & n && (e[8] = null == e[8] ? t[8] : ar(e[8], t[8]));
                    null == e[9] && (e[9] = t[9]);
                    (e[0] = t[0]), (e[1] = i);
                  })(b, m),
                (e = b[0]),
                (t = b[1]),
                (r = b[2]),
                (a = b[3]),
                (s = b[4]),
                !(f = b[9] =
                  void 0 === b[9] ? (l ? 0 : e.length) : or(b[9] - d, 0)) &&
                  24 & t &&
                  (t &= -25),
                t && 1 != t)
              )
                g =
                  8 == t || 16 == t
                    ? (function (e, t, r) {
                        var i = ki(e);
                        return function o() {
                          for (
                            var a = arguments.length,
                              s = n(a),
                              u = a,
                              c = $i(o);
                            u--;

                          )
                            s[u] = arguments[u];
                          var f =
                            a < 3 && s[0] !== c && s[a - 1] !== c
                              ? []
                              : Ht(s, c);
                          if ((a -= f.length) < r)
                            return Ri(
                              e,
                              t,
                              Oi,
                              o.placeholder,
                              void 0,
                              s,
                              f,
                              void 0,
                              void 0,
                              r - a
                            );
                          var l =
                            this && this !== Ve && this instanceof o ? i : e;
                          return it(l, this, s);
                        };
                      })(e, t, f)
                    : (32 != t && 33 != t) || s.length
                    ? Oi.apply(void 0, b)
                    : (function (e, t, r, i) {
                        var o = 1 & t,
                          a = ki(e);
                        return function t() {
                          for (
                            var s = -1,
                              u = arguments.length,
                              c = -1,
                              f = i.length,
                              l = n(f + u),
                              d =
                                this && this !== Ve && this instanceof t
                                  ? a
                                  : e;
                            ++c < f;

                          )
                            l[c] = i[c];
                          for (; u--; ) l[c++] = arguments[++s];
                          return it(d, o ? r : this, l);
                        };
                      })(e, t, r, a);
              else
                var g = (function (e, t, r) {
                  var n = 1 & t,
                    i = ki(e);
                  return function t() {
                    var o = this && this !== Ve && this instanceof t ? i : e;
                    return o.apply(n ? r : this, arguments);
                  };
                })(e, t, r);
              return So((m ? Fn : yo)(g, b), e, t);
            }
            function Li(e, t, r, n) {
              return void 0 === e || (Ia(e, _e[r]) && !Ee.call(n, r)) ? t : e;
            }
            function Hi(e, t, r, n, i, o) {
              return (
                Da(e) &&
                  Da(t) &&
                  (o.set(t, e), An(e, t, void 0, Hi, o), o.delete(t)),
                e
              );
            }
            function Fi(e) {
              return Ga(e) ? void 0 : e;
            }
            function Di(e, t, r, n, i, o) {
              var a = 1 & r,
                s = e.length,
                u = t.length;
              if (s != u && !(a && u > s)) return !1;
              var c = o.get(e);
              if (c && o.get(t)) return c == t;
              var f = -1,
                l = !0,
                d = 2 & r ? new Rr() : void 0;
              for (o.set(e, t), o.set(t, e); ++f < s; ) {
                var h = e[f],
                  p = t[f];
                if (n) var m = a ? n(p, h, f, t, e, o) : n(h, p, f, e, t, o);
                if (void 0 !== m) {
                  if (m) continue;
                  l = !1;
                  break;
                }
                if (d) {
                  if (
                    !bt(t, function (e, t) {
                      if (!Pt(d, t) && (h === e || i(h, e, r, n, o)))
                        return d.push(t);
                    })
                  ) {
                    l = !1;
                    break;
                  }
                } else if (h !== p && !i(h, p, r, n, o)) {
                  l = !1;
                  break;
                }
              }
              return o.delete(e), o.delete(t), l;
            }
            function Ki(e) {
              return _o(mo(e, void 0, Co), e + '');
            }
            function Wi(e) {
              return dn(e, ws, eo);
            }
            function Vi(e) {
              return dn(e, _s, to);
            }
            var Gi = gr
              ? function (e) {
                  return gr.get(e);
                }
              : Zs;
            function Xi(e) {
              for (
                var t = e.name + '',
                  r = vr[t],
                  n = Ee.call(vr, t) ? r.length : 0;
                n--;

              ) {
                var i = r[n],
                  o = i.func;
                if (null == o || o == e) return i.name;
              }
              return t;
            }
            function $i(e) {
              return (Ee.call(Tr, 'placeholder') ? Tr : e).placeholder;
            }
            function Ji() {
              var e = Tr.iteratee || Gs;
              return (
                (e = e === Gs ? Mn : e),
                arguments.length ? e(arguments[0], arguments[1]) : e
              );
            }
            function Zi(e, t) {
              var r,
                n,
                i = e.__data__;
              return (
                'string' == (n = typeof (r = t)) ||
                'number' == n ||
                'symbol' == n ||
                'boolean' == n
                  ? '__proto__' !== r
                  : null === r
              )
                ? i['string' == typeof t ? 'string' : 'hash']
                : i.map;
            }
            function Yi(e) {
              for (var t = ws(e), r = t.length; r--; ) {
                var n = t[r],
                  i = e[n];
                t[r] = [n, i, ho(i)];
              }
              return t;
            }
            function Qi(e, t) {
              var r = (function (e, t) {
                return null == e ? void 0 : e[t];
              })(e, t);
              return Sn(r) ? r : void 0;
            }
            var eo = er
                ? function (e) {
                    return null == e
                      ? []
                      : ((e = me(e)),
                        ct(er(e), function (t) {
                          return Xe.call(e, t);
                        }));
                  }
                : iu,
              to = er
                ? function (e) {
                    for (var t = []; e; ) ht(t, eo(e)), (e = We(e));
                    return t;
                  }
                : iu,
              ro = hn;
            function no(e, t, r) {
              for (var n = -1, i = (t = si(t, e)).length, o = !1; ++n < i; ) {
                var a = xo(t[n]);
                if (!(o = null != e && r(e, a))) break;
                e = e[a];
              }
              return o || ++n != i
                ? o
                : !!(i = null == e ? 0 : e.length) &&
                    Fa(i) &&
                    ao(a, i) &&
                    (Ba(e) || Na(e));
            }
            function io(e) {
              return 'function' != typeof e.constructor || lo(e)
                ? {}
                : Or(We(e));
            }
            function oo(e) {
              return Ba(e) || Na(e) || !!(Ze && e && e[Ze]);
            }
            function ao(e, t) {
              var r = typeof e;
              return (
                !!(t = null == t ? 9007199254740991 : t) &&
                ('number' == r || ('symbol' != r && se.test(e))) &&
                e > -1 &&
                e % 1 == 0 &&
                e < t
              );
            }
            function so(e, t, r) {
              if (!Da(r)) return !1;
              var n = typeof t;
              return (
                !!('number' == n
                  ? Ra(r) && ao(t, r.length)
                  : 'string' == n && t in r) && Ia(r[t], e)
              );
            }
            function uo(e, t) {
              if (Ba(e)) return !1;
              var r = typeof e;
              return (
                !(
                  'number' != r &&
                  'symbol' != r &&
                  'boolean' != r &&
                  null != e &&
                  !Za(e)
                ) ||
                D.test(e) ||
                !F.test(e) ||
                (null != t && e in me(t))
              );
            }
            function co(e) {
              var t = Xi(e),
                r = Tr[t];
              if ('function' != typeof r || !(t in Pr.prototype)) return !1;
              if (e === r) return !0;
              var n = Gi(r);
              return !!n && e === n[0];
            }
            ((lr && ro(new lr(new ArrayBuffer(1))) != M) ||
              (dr && ro(new dr()) != p) ||
              (hr && '[object Promise]' != ro(hr.resolve())) ||
              (pr && ro(new pr()) != v) ||
              (mr && ro(new mr()) != _)) &&
              (ro = function (e) {
                var t = hn(e),
                  r = t == b ? e.constructor : void 0,
                  n = r ? To(r) : '';
                if (n)
                  switch (n) {
                    case yr:
                      return M;
                    case wr:
                      return p;
                    case _r:
                      return '[object Promise]';
                    case Sr:
                      return v;
                    case Mr:
                      return _;
                  }
                return t;
              });
            var fo = Se ? La : ou;
            function lo(e) {
              var t = e && e.constructor;
              return e === (('function' == typeof t && t.prototype) || _e);
            }
            function ho(e) {
              return e == e && !Da(e);
            }
            function po(e, t) {
              return function (r) {
                return null != r && r[e] === t && (void 0 !== t || e in me(r));
              };
            }
            function mo(e, t, r) {
              return (
                (t = or(void 0 === t ? e.length - 1 : t, 0)),
                function () {
                  for (
                    var i = arguments,
                      o = -1,
                      a = or(i.length - t, 0),
                      s = n(a);
                    ++o < a;

                  )
                    s[o] = i[t + o];
                  o = -1;
                  for (var u = n(t + 1); ++o < t; ) u[o] = i[o];
                  return (u[t] = r(s)), it(e, this, u);
                }
              );
            }
            function bo(e, t) {
              return t.length < 2 ? e : ln(e, Wn(t, 0, -1));
            }
            function go(e, t) {
              for (var r = e.length, n = ar(t.length, r), i = gi(e); n--; ) {
                var o = t[n];
                e[n] = ao(o, r) ? i[o] : void 0;
              }
              return e;
            }
            function vo(e, t) {
              if (
                ('constructor' !== t || 'function' != typeof e[t]) &&
                '__proto__' != t
              )
                return e[t];
            }
            var yo = Mo(Fn),
              wo =
                Zt ||
                function (e, t) {
                  return Ve.setTimeout(e, t);
                },
              _o = Mo(Dn);
            function So(e, t, r) {
              var n = t + '';
              return _o(
                e,
                (function (e, t) {
                  var r = t.length;
                  if (!r) return e;
                  var n = r - 1;
                  return (
                    (t[n] = (r > 1 ? '& ' : '') + t[n]),
                    (t = t.join(r > 2 ? ', ' : ' ')),
                    e.replace(J, '{\n/* [wrapped with ' + t + '] */\n')
                  );
                })(
                  n,
                  (function (e, t) {
                    return (
                      at(a, function (r) {
                        var n = '_.' + r[0];
                        t & r[1] && !ft(e, n) && e.push(n);
                      }),
                      e.sort()
                    );
                  })(
                    (function (e) {
                      var t = e.match(Z);
                      return t ? t[1].split(Y) : [];
                    })(n),
                    r
                  )
                )
              );
            }
            function Mo(e) {
              var t = 0,
                r = 0;
              return function () {
                var n = sr(),
                  i = 16 - (n - r);
                if (((r = n), i > 0)) {
                  if (++t >= 800) return arguments[0];
                } else t = 0;
                return e.apply(void 0, arguments);
              };
            }
            function Eo(e, t) {
              var r = -1,
                n = e.length,
                i = n - 1;
              for (t = void 0 === t ? n : t; ++r < t; ) {
                var o = jn(r, i),
                  a = e[o];
                (e[o] = e[r]), (e[r] = a);
              }
              return (e.length = t), e;
            }
            var ko = (function (e) {
              var t = Ma(e, function (e) {
                  return 500 === r.size && r.clear(), e;
                }),
                r = t.cache;
              return t;
            })(function (e) {
              var t = [];
              return (
                46 === e.charCodeAt(0) && t.push(''),
                e.replace(K, function (e, r, n, i) {
                  t.push(n ? i.replace(ee, '$1') : r || e);
                }),
                t
              );
            });
            function xo(e) {
              if ('string' == typeof e || Za(e)) return e;
              var t = e + '';
              return '0' == t && 1 / e == -1 / 0 ? '-0' : t;
            }
            function To(e) {
              if (null != e) {
                try {
                  return Me.call(e);
                } catch (e) {}
                try {
                  return e + '';
                } catch (e) {}
              }
              return '';
            }
            function Oo(e) {
              if (e instanceof Pr) return e.clone();
              var t = new Ar(e.__wrapped__, e.__chain__);
              return (
                (t.__actions__ = gi(e.__actions__)),
                (t.__index__ = e.__index__),
                (t.__values__ = e.__values__),
                t
              );
            }
            var Io = qn(function (e, t) {
                return ja(e) ? Yr(e, on(t, 1, ja, !0)) : [];
              }),
              Ao = qn(function (e, t) {
                var r = Uo(t);
                return (
                  ja(r) && (r = void 0),
                  ja(e) ? Yr(e, on(t, 1, ja, !0), Ji(r, 2)) : []
                );
              }),
              Po = qn(function (e, t) {
                var r = Uo(t);
                return (
                  ja(r) && (r = void 0),
                  ja(e) ? Yr(e, on(t, 1, ja, !0), void 0, r) : []
                );
              });
            function No(e, t, r) {
              var n = null == e ? 0 : e.length;
              if (!n) return -1;
              var i = null == r ? 0 : ns(r);
              return i < 0 && (i = or(n + i, 0)), yt(e, Ji(t, 3), i);
            }
            function Bo(e, t, r) {
              var n = null == e ? 0 : e.length;
              if (!n) return -1;
              var i = n - 1;
              return (
                void 0 !== r &&
                  ((i = ns(r)), (i = r < 0 ? or(n + i, 0) : ar(i, n - 1))),
                yt(e, Ji(t, 3), i, !0)
              );
            }
            function Co(e) {
              return (null == e ? 0 : e.length) ? on(e, 1) : [];
            }
            function Ro(e) {
              return e && e.length ? e[0] : void 0;
            }
            var jo = qn(function (e) {
                var t = dt(e, oi);
                return t.length && t[0] === e[0] ? gn(t) : [];
              }),
              zo = qn(function (e) {
                var t = Uo(e),
                  r = dt(e, oi);
                return (
                  t === Uo(r) ? (t = void 0) : r.pop(),
                  r.length && r[0] === e[0] ? gn(r, Ji(t, 2)) : []
                );
              }),
              qo = qn(function (e) {
                var t = Uo(e),
                  r = dt(e, oi);
                return (
                  (t = 'function' == typeof t ? t : void 0) && r.pop(),
                  r.length && r[0] === e[0] ? gn(r, void 0, t) : []
                );
              });
            function Uo(e) {
              var t = null == e ? 0 : e.length;
              return t ? e[t - 1] : void 0;
            }
            var Lo = qn(Ho);
            function Ho(e, t) {
              return e && e.length && t && t.length ? Cn(e, t) : e;
            }
            var Fo = Ki(function (e, t) {
              var r = null == e ? 0 : e.length,
                n = Gr(e, t);
              return (
                Rn(
                  e,
                  dt(t, function (e) {
                    return ao(e, r) ? +e : e;
                  }).sort(pi)
                ),
                n
              );
            });
            function Do(e) {
              return null == e ? e : fr.call(e);
            }
            var Ko = qn(function (e) {
                return Yn(on(e, 1, ja, !0));
              }),
              Wo = qn(function (e) {
                var t = Uo(e);
                return ja(t) && (t = void 0), Yn(on(e, 1, ja, !0), Ji(t, 2));
              }),
              Vo = qn(function (e) {
                var t = Uo(e);
                return (
                  (t = 'function' == typeof t ? t : void 0),
                  Yn(on(e, 1, ja, !0), void 0, t)
                );
              });
            function Go(e) {
              if (!e || !e.length) return [];
              var t = 0;
              return (
                (e = ct(e, function (e) {
                  if (ja(e)) return (t = or(e.length, t)), !0;
                })),
                Ot(t, function (t) {
                  return dt(e, Et(t));
                })
              );
            }
            function Xo(e, t) {
              if (!e || !e.length) return [];
              var r = Go(e);
              return null == t
                ? r
                : dt(r, function (e) {
                    return it(t, void 0, e);
                  });
            }
            var $o = qn(function (e, t) {
                return ja(e) ? Yr(e, t) : [];
              }),
              Jo = qn(function (e) {
                return ni(ct(e, ja));
              }),
              Zo = qn(function (e) {
                var t = Uo(e);
                return ja(t) && (t = void 0), ni(ct(e, ja), Ji(t, 2));
              }),
              Yo = qn(function (e) {
                var t = Uo(e);
                return (
                  (t = 'function' == typeof t ? t : void 0),
                  ni(ct(e, ja), void 0, t)
                );
              }),
              Qo = qn(Go);
            var ea = qn(function (e) {
              var t = e.length,
                r = t > 1 ? e[t - 1] : void 0;
              return (
                (r = 'function' == typeof r ? (e.pop(), r) : void 0), Xo(e, r)
              );
            });
            function ta(e) {
              var t = Tr(e);
              return (t.__chain__ = !0), t;
            }
            function ra(e, t) {
              return t(e);
            }
            var na = Ki(function (e) {
              var t = e.length,
                r = t ? e[0] : 0,
                n = this.__wrapped__,
                i = function (t) {
                  return Gr(t, e);
                };
              return !(t > 1 || this.__actions__.length) &&
                n instanceof Pr &&
                ao(r)
                ? ((n = n.slice(r, +r + (t ? 1 : 0))).__actions__.push({
                    func: ra,
                    args: [i],
                    thisArg: void 0,
                  }),
                  new Ar(n, this.__chain__).thru(function (e) {
                    return t && !e.length && e.push(void 0), e;
                  }))
                : this.thru(i);
            });
            var ia = yi(function (e, t, r) {
              Ee.call(e, r) ? ++e[r] : Vr(e, r, 1);
            });
            var oa = xi(No),
              aa = xi(Bo);
            function sa(e, t) {
              return (Ba(e) ? at : Qr)(e, Ji(t, 3));
            }
            function ua(e, t) {
              return (Ba(e) ? st : en)(e, Ji(t, 3));
            }
            var ca = yi(function (e, t, r) {
              Ee.call(e, r) ? e[r].push(t) : Vr(e, r, [t]);
            });
            var fa = qn(function (e, t, r) {
                var i = -1,
                  o = 'function' == typeof t,
                  a = Ra(e) ? n(e.length) : [];
                return (
                  Qr(e, function (e) {
                    a[++i] = o ? it(t, e, r) : vn(e, t, r);
                  }),
                  a
                );
              }),
              la = yi(function (e, t, r) {
                Vr(e, r, t);
              });
            function da(e, t) {
              return (Ba(e) ? dt : Tn)(e, Ji(t, 3));
            }
            var ha = yi(
              function (e, t, r) {
                e[r ? 0 : 1].push(t);
              },
              function () {
                return [[], []];
              }
            );
            var pa = qn(function (e, t) {
                if (null == e) return [];
                var r = t.length;
                return (
                  r > 1 && so(e, t[0], t[1])
                    ? (t = [])
                    : r > 2 && so(t[0], t[1], t[2]) && (t = [t[0]]),
                  Nn(e, on(t, 1), [])
                );
              }),
              ma =
                Jt ||
                function () {
                  return Ve.Date.now();
                };
            function ba(e, t, r) {
              return (
                (t = r ? void 0 : t),
                Ui(
                  e,
                  128,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  (t = e && null == t ? e.length : t)
                )
              );
            }
            function ga(e, t) {
              var r;
              if ('function' != typeof t) throw new ve(i);
              return (
                (e = ns(e)),
                function () {
                  return (
                    --e > 0 && (r = t.apply(this, arguments)),
                    e <= 1 && (t = void 0),
                    r
                  );
                }
              );
            }
            var va = qn(function (e, t, r) {
                var n = 1;
                if (r.length) {
                  var i = Ht(r, $i(va));
                  n |= 32;
                }
                return Ui(e, n, t, r, i);
              }),
              ya = qn(function (e, t, r) {
                var n = 3;
                if (r.length) {
                  var i = Ht(r, $i(ya));
                  n |= 32;
                }
                return Ui(t, n, e, r, i);
              });
            function wa(e, t, r) {
              var n,
                o,
                a,
                s,
                u,
                c,
                f = 0,
                l = !1,
                d = !1,
                h = !0;
              if ('function' != typeof e) throw new ve(i);
              function p(t) {
                var r = n,
                  i = o;
                return (n = o = void 0), (f = t), (s = e.apply(i, r));
              }
              function m(e) {
                return (f = e), (u = wo(g, t)), l ? p(e) : s;
              }
              function b(e) {
                var r = e - c;
                return void 0 === c || r >= t || r < 0 || (d && e - f >= a);
              }
              function g() {
                var e = ma();
                if (b(e)) return v(e);
                u = wo(
                  g,
                  (function (e) {
                    var r = t - (e - c);
                    return d ? ar(r, a - (e - f)) : r;
                  })(e)
                );
              }
              function v(e) {
                return (u = void 0), h && n ? p(e) : ((n = o = void 0), s);
              }
              function y() {
                var e = ma(),
                  r = b(e);
                if (((n = arguments), (o = this), (c = e), r)) {
                  if (void 0 === u) return m(c);
                  if (d) return fi(u), (u = wo(g, t)), p(c);
                }
                return void 0 === u && (u = wo(g, t)), s;
              }
              return (
                (t = os(t) || 0),
                Da(r) &&
                  ((l = !!r.leading),
                  (a = (d = 'maxWait' in r) ? or(os(r.maxWait) || 0, t) : a),
                  (h = 'trailing' in r ? !!r.trailing : h)),
                (y.cancel = function () {
                  void 0 !== u && fi(u), (f = 0), (n = c = o = u = void 0);
                }),
                (y.flush = function () {
                  return void 0 === u ? s : v(ma());
                }),
                y
              );
            }
            var _a = qn(function (e, t) {
                return Zr(e, 1, t);
              }),
              Sa = qn(function (e, t, r) {
                return Zr(e, os(t) || 0, r);
              });
            function Ma(e, t) {
              if (
                'function' != typeof e ||
                (null != t && 'function' != typeof t)
              )
                throw new ve(i);
              var r = function () {
                var n = arguments,
                  i = t ? t.apply(this, n) : n[0],
                  o = r.cache;
                if (o.has(i)) return o.get(i);
                var a = e.apply(this, n);
                return (r.cache = o.set(i, a) || o), a;
              };
              return (r.cache = new (Ma.Cache || Cr)()), r;
            }
            function Ea(e) {
              if ('function' != typeof e) throw new ve(i);
              return function () {
                var t = arguments;
                switch (t.length) {
                  case 0:
                    return !e.call(this);
                  case 1:
                    return !e.call(this, t[0]);
                  case 2:
                    return !e.call(this, t[0], t[1]);
                  case 3:
                    return !e.call(this, t[0], t[1], t[2]);
                }
                return !e.apply(this, t);
              };
            }
            Ma.Cache = Cr;
            var ka = ui(function (e, t) {
                var r = (t =
                  1 == t.length && Ba(t[0])
                    ? dt(t[0], It(Ji()))
                    : dt(on(t, 1), It(Ji()))).length;
                return qn(function (n) {
                  for (var i = -1, o = ar(n.length, r); ++i < o; )
                    n[i] = t[i].call(this, n[i]);
                  return it(e, this, n);
                });
              }),
              xa = qn(function (e, t) {
                return Ui(e, 32, void 0, t, Ht(t, $i(xa)));
              }),
              Ta = qn(function (e, t) {
                return Ui(e, 64, void 0, t, Ht(t, $i(Ta)));
              }),
              Oa = Ki(function (e, t) {
                return Ui(e, 256, void 0, void 0, void 0, t);
              });
            function Ia(e, t) {
              return e === t || (e != e && t != t);
            }
            var Aa = Ci(pn),
              Pa = Ci(function (e, t) {
                return e >= t;
              }),
              Na = yn(
                (function () {
                  return arguments;
                })()
              )
                ? yn
                : function (e) {
                    return (
                      Ka(e) && Ee.call(e, 'callee') && !Xe.call(e, 'callee')
                    );
                  },
              Ba = n.isArray,
              Ca = Ye
                ? It(Ye)
                : function (e) {
                    return Ka(e) && hn(e) == S;
                  };
            function Ra(e) {
              return null != e && Fa(e.length) && !La(e);
            }
            function ja(e) {
              return Ka(e) && Ra(e);
            }
            var za = tr || ou,
              qa = Qe
                ? It(Qe)
                : function (e) {
                    return Ka(e) && hn(e) == f;
                  };
            function Ua(e) {
              if (!Ka(e)) return !1;
              var t = hn(e);
              return (
                t == l ||
                '[object DOMException]' == t ||
                ('string' == typeof e.message &&
                  'string' == typeof e.name &&
                  !Ga(e))
              );
            }
            function La(e) {
              if (!Da(e)) return !1;
              var t = hn(e);
              return (
                t == d ||
                t == h ||
                '[object AsyncFunction]' == t ||
                '[object Proxy]' == t
              );
            }
            function Ha(e) {
              return 'number' == typeof e && e == ns(e);
            }
            function Fa(e) {
              return (
                'number' == typeof e &&
                e > -1 &&
                e % 1 == 0 &&
                e <= 9007199254740991
              );
            }
            function Da(e) {
              var t = typeof e;
              return null != e && ('object' == t || 'function' == t);
            }
            function Ka(e) {
              return null != e && 'object' == typeof e;
            }
            var Wa = et
              ? It(et)
              : function (e) {
                  return Ka(e) && ro(e) == p;
                };
            function Va(e) {
              return 'number' == typeof e || (Ka(e) && hn(e) == m);
            }
            function Ga(e) {
              if (!Ka(e) || hn(e) != b) return !1;
              var t = We(e);
              if (null === t) return !0;
              var r = Ee.call(t, 'constructor') && t.constructor;
              return (
                'function' == typeof r && r instanceof r && Me.call(r) == Oe
              );
            }
            var Xa = tt
              ? It(tt)
              : function (e) {
                  return Ka(e) && hn(e) == g;
                };
            var $a = rt
              ? It(rt)
              : function (e) {
                  return Ka(e) && ro(e) == v;
                };
            function Ja(e) {
              return 'string' == typeof e || (!Ba(e) && Ka(e) && hn(e) == y);
            }
            function Za(e) {
              return 'symbol' == typeof e || (Ka(e) && hn(e) == w);
            }
            var Ya = nt
              ? It(nt)
              : function (e) {
                  return Ka(e) && Fa(e.length) && !!Ue[hn(e)];
                };
            var Qa = Ci(xn),
              es = Ci(function (e, t) {
                return e <= t;
              });
            function ts(e) {
              if (!e) return [];
              if (Ra(e)) return Ja(e) ? Wt(e) : gi(e);
              if (gt && e[gt])
                return (function (e) {
                  for (var t, r = []; !(t = e.next()).done; ) r.push(t.value);
                  return r;
                })(e[gt]());
              var t = ro(e);
              return (t == p ? Ut : t == v ? Ft : Is)(e);
            }
            function rs(e) {
              return e
                ? (e = os(e)) === 1 / 0 || e === -1 / 0
                  ? 17976931348623157e292 * (e < 0 ? -1 : 1)
                  : e == e
                  ? e
                  : 0
                : 0 === e
                ? e
                : 0;
            }
            function ns(e) {
              var t = rs(e),
                r = t % 1;
              return t == t ? (r ? t - r : t) : 0;
            }
            function is(e) {
              return e ? Xr(ns(e), 0, 4294967295) : 0;
            }
            function os(e) {
              if ('number' == typeof e) return e;
              if (Za(e)) return NaN;
              if (Da(e)) {
                var t = 'function' == typeof e.valueOf ? e.valueOf() : e;
                e = Da(t) ? t + '' : t;
              }
              if ('string' != typeof e) return 0 === e ? e : +e;
              e = e.replace(G, '');
              var r = ie.test(e);
              return r || ae.test(e)
                ? De(e.slice(2), r ? 2 : 8)
                : ne.test(e)
                ? NaN
                : +e;
            }
            function as(e) {
              return vi(e, _s(e));
            }
            function ss(e) {
              return null == e ? '' : Zn(e);
            }
            var us = wi(function (e, t) {
                if (lo(t) || Ra(t)) vi(t, ws(t), e);
                else for (var r in t) Ee.call(t, r) && Fr(e, r, t[r]);
              }),
              cs = wi(function (e, t) {
                vi(t, _s(t), e);
              }),
              fs = wi(function (e, t, r, n) {
                vi(t, _s(t), e, n);
              }),
              ls = wi(function (e, t, r, n) {
                vi(t, ws(t), e, n);
              }),
              ds = Ki(Gr);
            var hs = qn(function (e, t) {
                e = me(e);
                var r = -1,
                  n = t.length,
                  i = n > 2 ? t[2] : void 0;
                for (i && so(t[0], t[1], i) && (n = 1); ++r < n; )
                  for (
                    var o = t[r], a = _s(o), s = -1, u = a.length;
                    ++s < u;

                  ) {
                    var c = a[s],
                      f = e[c];
                    (void 0 === f || (Ia(f, _e[c]) && !Ee.call(e, c))) &&
                      (e[c] = o[c]);
                  }
                return e;
              }),
              ps = qn(function (e) {
                return e.push(void 0, Hi), it(Ms, void 0, e);
              });
            function ms(e, t, r) {
              var n = null == e ? void 0 : ln(e, t);
              return void 0 === n ? r : n;
            }
            function bs(e, t) {
              return null != e && no(e, t, bn);
            }
            var gs = Ii(function (e, t, r) {
                null != t &&
                  'function' != typeof t.toString &&
                  (t = Te.call(t)),
                  (e[t] = r);
              }, Ds(Vs)),
              vs = Ii(function (e, t, r) {
                null != t &&
                  'function' != typeof t.toString &&
                  (t = Te.call(t)),
                  Ee.call(e, t) ? e[t].push(r) : (e[t] = [r]);
              }, Ji),
              ys = qn(vn);
            function ws(e) {
              return Ra(e) ? zr(e) : En(e);
            }
            function _s(e) {
              return Ra(e) ? zr(e, !0) : kn(e);
            }
            var Ss = wi(function (e, t, r) {
                An(e, t, r);
              }),
              Ms = wi(function (e, t, r, n) {
                An(e, t, r, n);
              }),
              Es = Ki(function (e, t) {
                var r = {};
                if (null == e) return r;
                var n = !1;
                (t = dt(t, function (t) {
                  return (t = si(t, e)), n || (n = t.length > 1), t;
                })),
                  vi(e, Vi(e), r),
                  n && (r = $r(r, 7, Fi));
                for (var i = t.length; i--; ) Qn(r, t[i]);
                return r;
              });
            var ks = Ki(function (e, t) {
              return null == e
                ? {}
                : (function (e, t) {
                    return Bn(e, t, function (t, r) {
                      return bs(e, r);
                    });
                  })(e, t);
            });
            function xs(e, t) {
              if (null == e) return {};
              var r = dt(Vi(e), function (e) {
                return [e];
              });
              return (
                (t = Ji(t)),
                Bn(e, r, function (e, r) {
                  return t(e, r[0]);
                })
              );
            }
            var Ts = qi(ws),
              Os = qi(_s);
            function Is(e) {
              return null == e ? [] : At(e, ws(e));
            }
            var As = Ei(function (e, t, r) {
              return (t = t.toLowerCase()), e + (r ? Ps(t) : t);
            });
            function Ps(e) {
              return Us(ss(e).toLowerCase());
            }
            function Ns(e) {
              return (e = ss(e)) && e.replace(ue, Rt).replace(Ne, '');
            }
            var Bs = Ei(function (e, t, r) {
                return e + (r ? '-' : '') + t.toLowerCase();
              }),
              Cs = Ei(function (e, t, r) {
                return e + (r ? ' ' : '') + t.toLowerCase();
              }),
              Rs = Mi('toLowerCase');
            var js = Ei(function (e, t, r) {
              return e + (r ? '_' : '') + t.toLowerCase();
            });
            var zs = Ei(function (e, t, r) {
              return e + (r ? ' ' : '') + Us(t);
            });
            var qs = Ei(function (e, t, r) {
                return e + (r ? ' ' : '') + t.toUpperCase();
              }),
              Us = Mi('toUpperCase');
            function Ls(e, t, r) {
              return (
                (e = ss(e)),
                void 0 === (t = r ? void 0 : t)
                  ? (function (e) {
                      return je.test(e);
                    })(e)
                    ? (function (e) {
                        return e.match(Ce) || [];
                      })(e)
                    : (function (e) {
                        return e.match(Q) || [];
                      })(e)
                  : e.match(t) || []
              );
            }
            var Hs = qn(function (e, t) {
                try {
                  return it(e, void 0, t);
                } catch (e) {
                  return Ua(e) ? e : new de(e);
                }
              }),
              Fs = Ki(function (e, t) {
                return (
                  at(t, function (t) {
                    (t = xo(t)), Vr(e, t, va(e[t], e));
                  }),
                  e
                );
              });
            function Ds(e) {
              return function () {
                return e;
              };
            }
            var Ks = Ti(),
              Ws = Ti(!0);
            function Vs(e) {
              return e;
            }
            function Gs(e) {
              return Mn('function' == typeof e ? e : $r(e, 1));
            }
            var Xs = qn(function (e, t) {
                return function (r) {
                  return vn(r, e, t);
                };
              }),
              $s = qn(function (e, t) {
                return function (r) {
                  return vn(e, r, t);
                };
              });
            function Js(e, t, r) {
              var n = ws(t),
                i = fn(t, n);
              null != r ||
                (Da(t) && (i.length || !n.length)) ||
                ((r = t), (t = e), (e = this), (i = fn(t, ws(t))));
              var o = !(Da(r) && 'chain' in r && !r.chain),
                a = La(e);
              return (
                at(i, function (r) {
                  var n = t[r];
                  (e[r] = n),
                    a &&
                      (e.prototype[r] = function () {
                        var t = this.__chain__;
                        if (o || t) {
                          var r = e(this.__wrapped__),
                            i = (r.__actions__ = gi(this.__actions__));
                          return (
                            i.push({ func: n, args: arguments, thisArg: e }),
                            (r.__chain__ = t),
                            r
                          );
                        }
                        return n.apply(e, ht([this.value()], arguments));
                      });
                }),
                e
              );
            }
            function Zs() {}
            var Ys = Pi(dt),
              Qs = Pi(ut),
              eu = Pi(bt);
            function tu(e) {
              return uo(e)
                ? Et(xo(e))
                : (function (e) {
                    return function (t) {
                      return ln(t, e);
                    };
                  })(e);
            }
            var ru = Bi(),
              nu = Bi(!0);
            function iu() {
              return [];
            }
            function ou() {
              return !1;
            }
            var au = Ai(function (e, t) {
                return e + t;
              }, 0),
              su = ji('ceil'),
              uu = Ai(function (e, t) {
                return e / t;
              }, 1),
              cu = ji('floor');
            var fu,
              lu = Ai(function (e, t) {
                return e * t;
              }, 1),
              du = ji('round'),
              hu = Ai(function (e, t) {
                return e - t;
              }, 0);
            return (
              (Tr.after = function (e, t) {
                if ('function' != typeof t) throw new ve(i);
                return (
                  (e = ns(e)),
                  function () {
                    if (--e < 1) return t.apply(this, arguments);
                  }
                );
              }),
              (Tr.ary = ba),
              (Tr.assign = us),
              (Tr.assignIn = cs),
              (Tr.assignInWith = fs),
              (Tr.assignWith = ls),
              (Tr.at = ds),
              (Tr.before = ga),
              (Tr.bind = va),
              (Tr.bindAll = Fs),
              (Tr.bindKey = ya),
              (Tr.castArray = function () {
                if (!arguments.length) return [];
                var e = arguments[0];
                return Ba(e) ? e : [e];
              }),
              (Tr.chain = ta),
              (Tr.chunk = function (e, t, r) {
                t = (r ? so(e, t, r) : void 0 === t) ? 1 : or(ns(t), 0);
                var i = null == e ? 0 : e.length;
                if (!i || t < 1) return [];
                for (var o = 0, a = 0, s = n(Yt(i / t)); o < i; )
                  s[a++] = Wn(e, o, (o += t));
                return s;
              }),
              (Tr.compact = function (e) {
                for (
                  var t = -1, r = null == e ? 0 : e.length, n = 0, i = [];
                  ++t < r;

                ) {
                  var o = e[t];
                  o && (i[n++] = o);
                }
                return i;
              }),
              (Tr.concat = function () {
                var e = arguments.length;
                if (!e) return [];
                for (var t = n(e - 1), r = arguments[0], i = e; i--; )
                  t[i - 1] = arguments[i];
                return ht(Ba(r) ? gi(r) : [r], on(t, 1));
              }),
              (Tr.cond = function (e) {
                var t = null == e ? 0 : e.length,
                  r = Ji();
                return (
                  (e = t
                    ? dt(e, function (e) {
                        if ('function' != typeof e[1]) throw new ve(i);
                        return [r(e[0]), e[1]];
                      })
                    : []),
                  qn(function (r) {
                    for (var n = -1; ++n < t; ) {
                      var i = e[n];
                      if (it(i[0], this, r)) return it(i[1], this, r);
                    }
                  })
                );
              }),
              (Tr.conforms = function (e) {
                return (function (e) {
                  var t = ws(e);
                  return function (r) {
                    return Jr(r, e, t);
                  };
                })($r(e, 1));
              }),
              (Tr.constant = Ds),
              (Tr.countBy = ia),
              (Tr.create = function (e, t) {
                var r = Or(e);
                return null == t ? r : Wr(r, t);
              }),
              (Tr.curry = function e(t, r, n) {
                var i = Ui(
                  t,
                  8,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  (r = n ? void 0 : r)
                );
                return (i.placeholder = e.placeholder), i;
              }),
              (Tr.curryRight = function e(t, r, n) {
                var i = Ui(
                  t,
                  16,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  (r = n ? void 0 : r)
                );
                return (i.placeholder = e.placeholder), i;
              }),
              (Tr.debounce = wa),
              (Tr.defaults = hs),
              (Tr.defaultsDeep = ps),
              (Tr.defer = _a),
              (Tr.delay = Sa),
              (Tr.difference = Io),
              (Tr.differenceBy = Ao),
              (Tr.differenceWith = Po),
              (Tr.drop = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                return n
                  ? Wn(e, (t = r || void 0 === t ? 1 : ns(t)) < 0 ? 0 : t, n)
                  : [];
              }),
              (Tr.dropRight = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                return n
                  ? Wn(
                      e,
                      0,
                      (t = n - (t = r || void 0 === t ? 1 : ns(t))) < 0 ? 0 : t
                    )
                  : [];
              }),
              (Tr.dropRightWhile = function (e, t) {
                return e && e.length ? ti(e, Ji(t, 3), !0, !0) : [];
              }),
              (Tr.dropWhile = function (e, t) {
                return e && e.length ? ti(e, Ji(t, 3), !0) : [];
              }),
              (Tr.fill = function (e, t, r, n) {
                var i = null == e ? 0 : e.length;
                return i
                  ? (r &&
                      'number' != typeof r &&
                      so(e, t, r) &&
                      ((r = 0), (n = i)),
                    (function (e, t, r, n) {
                      var i = e.length;
                      for (
                        (r = ns(r)) < 0 && (r = -r > i ? 0 : i + r),
                          (n = void 0 === n || n > i ? i : ns(n)) < 0 &&
                            (n += i),
                          n = r > n ? 0 : is(n);
                        r < n;

                      )
                        e[r++] = t;
                      return e;
                    })(e, t, r, n))
                  : [];
              }),
              (Tr.filter = function (e, t) {
                return (Ba(e) ? ct : nn)(e, Ji(t, 3));
              }),
              (Tr.flatMap = function (e, t) {
                return on(da(e, t), 1);
              }),
              (Tr.flatMapDeep = function (e, t) {
                return on(da(e, t), 1 / 0);
              }),
              (Tr.flatMapDepth = function (e, t, r) {
                return (r = void 0 === r ? 1 : ns(r)), on(da(e, t), r);
              }),
              (Tr.flatten = Co),
              (Tr.flattenDeep = function (e) {
                return (null == e ? 0 : e.length) ? on(e, 1 / 0) : [];
              }),
              (Tr.flattenDepth = function (e, t) {
                return (null == e ? 0 : e.length)
                  ? on(e, (t = void 0 === t ? 1 : ns(t)))
                  : [];
              }),
              (Tr.flip = function (e) {
                return Ui(e, 512);
              }),
              (Tr.flow = Ks),
              (Tr.flowRight = Ws),
              (Tr.fromPairs = function (e) {
                for (
                  var t = -1, r = null == e ? 0 : e.length, n = {};
                  ++t < r;

                ) {
                  var i = e[t];
                  n[i[0]] = i[1];
                }
                return n;
              }),
              (Tr.functions = function (e) {
                return null == e ? [] : fn(e, ws(e));
              }),
              (Tr.functionsIn = function (e) {
                return null == e ? [] : fn(e, _s(e));
              }),
              (Tr.groupBy = ca),
              (Tr.initial = function (e) {
                return (null == e ? 0 : e.length) ? Wn(e, 0, -1) : [];
              }),
              (Tr.intersection = jo),
              (Tr.intersectionBy = zo),
              (Tr.intersectionWith = qo),
              (Tr.invert = gs),
              (Tr.invertBy = vs),
              (Tr.invokeMap = fa),
              (Tr.iteratee = Gs),
              (Tr.keyBy = la),
              (Tr.keys = ws),
              (Tr.keysIn = _s),
              (Tr.map = da),
              (Tr.mapKeys = function (e, t) {
                var r = {};
                return (
                  (t = Ji(t, 3)),
                  un(e, function (e, n, i) {
                    Vr(r, t(e, n, i), e);
                  }),
                  r
                );
              }),
              (Tr.mapValues = function (e, t) {
                var r = {};
                return (
                  (t = Ji(t, 3)),
                  un(e, function (e, n, i) {
                    Vr(r, n, t(e, n, i));
                  }),
                  r
                );
              }),
              (Tr.matches = function (e) {
                return On($r(e, 1));
              }),
              (Tr.matchesProperty = function (e, t) {
                return In(e, $r(t, 1));
              }),
              (Tr.memoize = Ma),
              (Tr.merge = Ss),
              (Tr.mergeWith = Ms),
              (Tr.method = Xs),
              (Tr.methodOf = $s),
              (Tr.mixin = Js),
              (Tr.negate = Ea),
              (Tr.nthArg = function (e) {
                return (
                  (e = ns(e)),
                  qn(function (t) {
                    return Pn(t, e);
                  })
                );
              }),
              (Tr.omit = Es),
              (Tr.omitBy = function (e, t) {
                return xs(e, Ea(Ji(t)));
              }),
              (Tr.once = function (e) {
                return ga(2, e);
              }),
              (Tr.orderBy = function (e, t, r, n) {
                return null == e
                  ? []
                  : (Ba(t) || (t = null == t ? [] : [t]),
                    Ba((r = n ? void 0 : r)) || (r = null == r ? [] : [r]),
                    Nn(e, t, r));
              }),
              (Tr.over = Ys),
              (Tr.overArgs = ka),
              (Tr.overEvery = Qs),
              (Tr.overSome = eu),
              (Tr.partial = xa),
              (Tr.partialRight = Ta),
              (Tr.partition = ha),
              (Tr.pick = ks),
              (Tr.pickBy = xs),
              (Tr.property = tu),
              (Tr.propertyOf = function (e) {
                return function (t) {
                  return null == e ? void 0 : ln(e, t);
                };
              }),
              (Tr.pull = Lo),
              (Tr.pullAll = Ho),
              (Tr.pullAllBy = function (e, t, r) {
                return e && e.length && t && t.length ? Cn(e, t, Ji(r, 2)) : e;
              }),
              (Tr.pullAllWith = function (e, t, r) {
                return e && e.length && t && t.length ? Cn(e, t, void 0, r) : e;
              }),
              (Tr.pullAt = Fo),
              (Tr.range = ru),
              (Tr.rangeRight = nu),
              (Tr.rearg = Oa),
              (Tr.reject = function (e, t) {
                return (Ba(e) ? ct : nn)(e, Ea(Ji(t, 3)));
              }),
              (Tr.remove = function (e, t) {
                var r = [];
                if (!e || !e.length) return r;
                var n = -1,
                  i = [],
                  o = e.length;
                for (t = Ji(t, 3); ++n < o; ) {
                  var a = e[n];
                  t(a, n, e) && (r.push(a), i.push(n));
                }
                return Rn(e, i), r;
              }),
              (Tr.rest = function (e, t) {
                if ('function' != typeof e) throw new ve(i);
                return qn(e, (t = void 0 === t ? t : ns(t)));
              }),
              (Tr.reverse = Do),
              (Tr.sampleSize = function (e, t, r) {
                return (
                  (t = (r ? so(e, t, r) : void 0 === t) ? 1 : ns(t)),
                  (Ba(e) ? Ur : Ln)(e, t)
                );
              }),
              (Tr.set = function (e, t, r) {
                return null == e ? e : Hn(e, t, r);
              }),
              (Tr.setWith = function (e, t, r, n) {
                return (
                  (n = 'function' == typeof n ? n : void 0),
                  null == e ? e : Hn(e, t, r, n)
                );
              }),
              (Tr.shuffle = function (e) {
                return (Ba(e) ? Lr : Kn)(e);
              }),
              (Tr.slice = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                return n
                  ? (r && 'number' != typeof r && so(e, t, r)
                      ? ((t = 0), (r = n))
                      : ((t = null == t ? 0 : ns(t)),
                        (r = void 0 === r ? n : ns(r))),
                    Wn(e, t, r))
                  : [];
              }),
              (Tr.sortBy = pa),
              (Tr.sortedUniq = function (e) {
                return e && e.length ? $n(e) : [];
              }),
              (Tr.sortedUniqBy = function (e, t) {
                return e && e.length ? $n(e, Ji(t, 2)) : [];
              }),
              (Tr.split = function (e, t, r) {
                return (
                  r && 'number' != typeof r && so(e, t, r) && (t = r = void 0),
                  (r = void 0 === r ? 4294967295 : r >>> 0)
                    ? (e = ss(e)) &&
                      ('string' == typeof t || (null != t && !Xa(t))) &&
                      !(t = Zn(t)) &&
                      qt(e)
                      ? ci(Wt(e), 0, r)
                      : e.split(t, r)
                    : []
                );
              }),
              (Tr.spread = function (e, t) {
                if ('function' != typeof e) throw new ve(i);
                return (
                  (t = null == t ? 0 : or(ns(t), 0)),
                  qn(function (r) {
                    var n = r[t],
                      i = ci(r, 0, t);
                    return n && ht(i, n), it(e, this, i);
                  })
                );
              }),
              (Tr.tail = function (e) {
                var t = null == e ? 0 : e.length;
                return t ? Wn(e, 1, t) : [];
              }),
              (Tr.take = function (e, t, r) {
                return e && e.length
                  ? Wn(e, 0, (t = r || void 0 === t ? 1 : ns(t)) < 0 ? 0 : t)
                  : [];
              }),
              (Tr.takeRight = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                return n
                  ? Wn(
                      e,
                      (t = n - (t = r || void 0 === t ? 1 : ns(t))) < 0 ? 0 : t,
                      n
                    )
                  : [];
              }),
              (Tr.takeRightWhile = function (e, t) {
                return e && e.length ? ti(e, Ji(t, 3), !1, !0) : [];
              }),
              (Tr.takeWhile = function (e, t) {
                return e && e.length ? ti(e, Ji(t, 3)) : [];
              }),
              (Tr.tap = function (e, t) {
                return t(e), e;
              }),
              (Tr.throttle = function (e, t, r) {
                var n = !0,
                  o = !0;
                if ('function' != typeof e) throw new ve(i);
                return (
                  Da(r) &&
                    ((n = 'leading' in r ? !!r.leading : n),
                    (o = 'trailing' in r ? !!r.trailing : o)),
                  wa(e, t, { leading: n, maxWait: t, trailing: o })
                );
              }),
              (Tr.thru = ra),
              (Tr.toArray = ts),
              (Tr.toPairs = Ts),
              (Tr.toPairsIn = Os),
              (Tr.toPath = function (e) {
                return Ba(e) ? dt(e, xo) : Za(e) ? [e] : gi(ko(ss(e)));
              }),
              (Tr.toPlainObject = as),
              (Tr.transform = function (e, t, r) {
                var n = Ba(e),
                  i = n || za(e) || Ya(e);
                if (((t = Ji(t, 4)), null == r)) {
                  var o = e && e.constructor;
                  r = i ? (n ? new o() : []) : Da(e) && La(o) ? Or(We(e)) : {};
                }
                return (
                  (i ? at : un)(e, function (e, n, i) {
                    return t(r, e, n, i);
                  }),
                  r
                );
              }),
              (Tr.unary = function (e) {
                return ba(e, 1);
              }),
              (Tr.union = Ko),
              (Tr.unionBy = Wo),
              (Tr.unionWith = Vo),
              (Tr.uniq = function (e) {
                return e && e.length ? Yn(e) : [];
              }),
              (Tr.uniqBy = function (e, t) {
                return e && e.length ? Yn(e, Ji(t, 2)) : [];
              }),
              (Tr.uniqWith = function (e, t) {
                return (
                  (t = 'function' == typeof t ? t : void 0),
                  e && e.length ? Yn(e, void 0, t) : []
                );
              }),
              (Tr.unset = function (e, t) {
                return null == e || Qn(e, t);
              }),
              (Tr.unzip = Go),
              (Tr.unzipWith = Xo),
              (Tr.update = function (e, t, r) {
                return null == e ? e : ei(e, t, ai(r));
              }),
              (Tr.updateWith = function (e, t, r, n) {
                return (
                  (n = 'function' == typeof n ? n : void 0),
                  null == e ? e : ei(e, t, ai(r), n)
                );
              }),
              (Tr.values = Is),
              (Tr.valuesIn = function (e) {
                return null == e ? [] : At(e, _s(e));
              }),
              (Tr.without = $o),
              (Tr.words = Ls),
              (Tr.wrap = function (e, t) {
                return xa(ai(t), e);
              }),
              (Tr.xor = Jo),
              (Tr.xorBy = Zo),
              (Tr.xorWith = Yo),
              (Tr.zip = Qo),
              (Tr.zipObject = function (e, t) {
                return ii(e || [], t || [], Fr);
              }),
              (Tr.zipObjectDeep = function (e, t) {
                return ii(e || [], t || [], Hn);
              }),
              (Tr.zipWith = ea),
              (Tr.entries = Ts),
              (Tr.entriesIn = Os),
              (Tr.extend = cs),
              (Tr.extendWith = fs),
              Js(Tr, Tr),
              (Tr.add = au),
              (Tr.attempt = Hs),
              (Tr.camelCase = As),
              (Tr.capitalize = Ps),
              (Tr.ceil = su),
              (Tr.clamp = function (e, t, r) {
                return (
                  void 0 === r && ((r = t), (t = void 0)),
                  void 0 !== r && (r = (r = os(r)) == r ? r : 0),
                  void 0 !== t && (t = (t = os(t)) == t ? t : 0),
                  Xr(os(e), t, r)
                );
              }),
              (Tr.clone = function (e) {
                return $r(e, 4);
              }),
              (Tr.cloneDeep = function (e) {
                return $r(e, 5);
              }),
              (Tr.cloneDeepWith = function (e, t) {
                return $r(e, 5, (t = 'function' == typeof t ? t : void 0));
              }),
              (Tr.cloneWith = function (e, t) {
                return $r(e, 4, (t = 'function' == typeof t ? t : void 0));
              }),
              (Tr.conformsTo = function (e, t) {
                return null == t || Jr(e, t, ws(t));
              }),
              (Tr.deburr = Ns),
              (Tr.defaultTo = function (e, t) {
                return null == e || e != e ? t : e;
              }),
              (Tr.divide = uu),
              (Tr.endsWith = function (e, t, r) {
                (e = ss(e)), (t = Zn(t));
                var n = e.length,
                  i = (r = void 0 === r ? n : Xr(ns(r), 0, n));
                return (r -= t.length) >= 0 && e.slice(r, i) == t;
              }),
              (Tr.eq = Ia),
              (Tr.escape = function (e) {
                return (e = ss(e)) && q.test(e) ? e.replace(j, jt) : e;
              }),
              (Tr.escapeRegExp = function (e) {
                return (e = ss(e)) && V.test(e) ? e.replace(W, '\\$&') : e;
              }),
              (Tr.every = function (e, t, r) {
                var n = Ba(e) ? ut : tn;
                return r && so(e, t, r) && (t = void 0), n(e, Ji(t, 3));
              }),
              (Tr.find = oa),
              (Tr.findIndex = No),
              (Tr.findKey = function (e, t) {
                return vt(e, Ji(t, 3), un);
              }),
              (Tr.findLast = aa),
              (Tr.findLastIndex = Bo),
              (Tr.findLastKey = function (e, t) {
                return vt(e, Ji(t, 3), cn);
              }),
              (Tr.floor = cu),
              (Tr.forEach = sa),
              (Tr.forEachRight = ua),
              (Tr.forIn = function (e, t) {
                return null == e ? e : an(e, Ji(t, 3), _s);
              }),
              (Tr.forInRight = function (e, t) {
                return null == e ? e : sn(e, Ji(t, 3), _s);
              }),
              (Tr.forOwn = function (e, t) {
                return e && un(e, Ji(t, 3));
              }),
              (Tr.forOwnRight = function (e, t) {
                return e && cn(e, Ji(t, 3));
              }),
              (Tr.get = ms),
              (Tr.gt = Aa),
              (Tr.gte = Pa),
              (Tr.has = function (e, t) {
                return null != e && no(e, t, mn);
              }),
              (Tr.hasIn = bs),
              (Tr.head = Ro),
              (Tr.identity = Vs),
              (Tr.includes = function (e, t, r, n) {
                (e = Ra(e) ? e : Is(e)), (r = r && !n ? ns(r) : 0);
                var i = e.length;
                return (
                  r < 0 && (r = or(i + r, 0)),
                  Ja(e)
                    ? r <= i && e.indexOf(t, r) > -1
                    : !!i && wt(e, t, r) > -1
                );
              }),
              (Tr.indexOf = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                if (!n) return -1;
                var i = null == r ? 0 : ns(r);
                return i < 0 && (i = or(n + i, 0)), wt(e, t, i);
              }),
              (Tr.inRange = function (e, t, r) {
                return (
                  (t = rs(t)),
                  void 0 === r ? ((r = t), (t = 0)) : (r = rs(r)),
                  (function (e, t, r) {
                    return e >= ar(t, r) && e < or(t, r);
                  })((e = os(e)), t, r)
                );
              }),
              (Tr.invoke = ys),
              (Tr.isArguments = Na),
              (Tr.isArray = Ba),
              (Tr.isArrayBuffer = Ca),
              (Tr.isArrayLike = Ra),
              (Tr.isArrayLikeObject = ja),
              (Tr.isBoolean = function (e) {
                return !0 === e || !1 === e || (Ka(e) && hn(e) == c);
              }),
              (Tr.isBuffer = za),
              (Tr.isDate = qa),
              (Tr.isElement = function (e) {
                return Ka(e) && 1 === e.nodeType && !Ga(e);
              }),
              (Tr.isEmpty = function (e) {
                if (null == e) return !0;
                if (
                  Ra(e) &&
                  (Ba(e) ||
                    'string' == typeof e ||
                    'function' == typeof e.splice ||
                    za(e) ||
                    Ya(e) ||
                    Na(e))
                )
                  return !e.length;
                var t = ro(e);
                if (t == p || t == v) return !e.size;
                if (lo(e)) return !En(e).length;
                for (var r in e) if (Ee.call(e, r)) return !1;
                return !0;
              }),
              (Tr.isEqual = function (e, t) {
                return wn(e, t);
              }),
              (Tr.isEqualWith = function (e, t, r) {
                var n = (r = 'function' == typeof r ? r : void 0)
                  ? r(e, t)
                  : void 0;
                return void 0 === n ? wn(e, t, void 0, r) : !!n;
              }),
              (Tr.isError = Ua),
              (Tr.isFinite = function (e) {
                return 'number' == typeof e && rr(e);
              }),
              (Tr.isFunction = La),
              (Tr.isInteger = Ha),
              (Tr.isLength = Fa),
              (Tr.isMap = Wa),
              (Tr.isMatch = function (e, t) {
                return e === t || _n(e, t, Yi(t));
              }),
              (Tr.isMatchWith = function (e, t, r) {
                return (
                  (r = 'function' == typeof r ? r : void 0), _n(e, t, Yi(t), r)
                );
              }),
              (Tr.isNaN = function (e) {
                return Va(e) && e != +e;
              }),
              (Tr.isNative = function (e) {
                if (fo(e))
                  throw new de(
                    'Unsupported core-js use. Try https://npms.io/search?q=ponyfill.'
                  );
                return Sn(e);
              }),
              (Tr.isNil = function (e) {
                return null == e;
              }),
              (Tr.isNull = function (e) {
                return null === e;
              }),
              (Tr.isNumber = Va),
              (Tr.isObject = Da),
              (Tr.isObjectLike = Ka),
              (Tr.isPlainObject = Ga),
              (Tr.isRegExp = Xa),
              (Tr.isSafeInteger = function (e) {
                return Ha(e) && e >= -9007199254740991 && e <= 9007199254740991;
              }),
              (Tr.isSet = $a),
              (Tr.isString = Ja),
              (Tr.isSymbol = Za),
              (Tr.isTypedArray = Ya),
              (Tr.isUndefined = function (e) {
                return void 0 === e;
              }),
              (Tr.isWeakMap = function (e) {
                return Ka(e) && ro(e) == _;
              }),
              (Tr.isWeakSet = function (e) {
                return Ka(e) && '[object WeakSet]' == hn(e);
              }),
              (Tr.join = function (e, t) {
                return null == e ? '' : nr.call(e, t);
              }),
              (Tr.kebabCase = Bs),
              (Tr.last = Uo),
              (Tr.lastIndexOf = function (e, t, r) {
                var n = null == e ? 0 : e.length;
                if (!n) return -1;
                var i = n;
                return (
                  void 0 !== r &&
                    (i = (i = ns(r)) < 0 ? or(n + i, 0) : ar(i, n - 1)),
                  t == t
                    ? (function (e, t, r) {
                        for (var n = r + 1; n--; ) if (e[n] === t) return n;
                        return n;
                      })(e, t, i)
                    : yt(e, St, i, !0)
                );
              }),
              (Tr.lowerCase = Cs),
              (Tr.lowerFirst = Rs),
              (Tr.lt = Qa),
              (Tr.lte = es),
              (Tr.max = function (e) {
                return e && e.length ? rn(e, Vs, pn) : void 0;
              }),
              (Tr.maxBy = function (e, t) {
                return e && e.length ? rn(e, Ji(t, 2), pn) : void 0;
              }),
              (Tr.mean = function (e) {
                return Mt(e, Vs);
              }),
              (Tr.meanBy = function (e, t) {
                return Mt(e, Ji(t, 2));
              }),
              (Tr.min = function (e) {
                return e && e.length ? rn(e, Vs, xn) : void 0;
              }),
              (Tr.minBy = function (e, t) {
                return e && e.length ? rn(e, Ji(t, 2), xn) : void 0;
              }),
              (Tr.stubArray = iu),
              (Tr.stubFalse = ou),
              (Tr.stubObject = function () {
                return {};
              }),
              (Tr.stubString = function () {
                return '';
              }),
              (Tr.stubTrue = function () {
                return !0;
              }),
              (Tr.multiply = lu),
              (Tr.nth = function (e, t) {
                return e && e.length ? Pn(e, ns(t)) : void 0;
              }),
              (Tr.noConflict = function () {
                return Ve._ === this && (Ve._ = Ie), this;
              }),
              (Tr.noop = Zs),
              (Tr.now = ma),
              (Tr.pad = function (e, t, r) {
                e = ss(e);
                var n = (t = ns(t)) ? Kt(e) : 0;
                if (!t || n >= t) return e;
                var i = (t - n) / 2;
                return Ni(Qt(i), r) + e + Ni(Yt(i), r);
              }),
              (Tr.padEnd = function (e, t, r) {
                e = ss(e);
                var n = (t = ns(t)) ? Kt(e) : 0;
                return t && n < t ? e + Ni(t - n, r) : e;
              }),
              (Tr.padStart = function (e, t, r) {
                e = ss(e);
                var n = (t = ns(t)) ? Kt(e) : 0;
                return t && n < t ? Ni(t - n, r) + e : e;
              }),
              (Tr.parseInt = function (e, t, r) {
                return (
                  r || null == t ? (t = 0) : t && (t = +t),
                  ur(ss(e).replace(X, ''), t || 0)
                );
              }),
              (Tr.random = function (e, t, r) {
                if (
                  (r &&
                    'boolean' != typeof r &&
                    so(e, t, r) &&
                    (t = r = void 0),
                  void 0 === r &&
                    ('boolean' == typeof t
                      ? ((r = t), (t = void 0))
                      : 'boolean' == typeof e && ((r = e), (e = void 0))),
                  void 0 === e && void 0 === t
                    ? ((e = 0), (t = 1))
                    : ((e = rs(e)),
                      void 0 === t ? ((t = e), (e = 0)) : (t = rs(t))),
                  e > t)
                ) {
                  var n = e;
                  (e = t), (t = n);
                }
                if (r || e % 1 || t % 1) {
                  var i = cr();
                  return ar(
                    e + i * (t - e + Fe('1e-' + ((i + '').length - 1))),
                    t
                  );
                }
                return jn(e, t);
              }),
              (Tr.reduce = function (e, t, r) {
                var n = Ba(e) ? pt : xt,
                  i = arguments.length < 3;
                return n(e, Ji(t, 4), r, i, Qr);
              }),
              (Tr.reduceRight = function (e, t, r) {
                var n = Ba(e) ? mt : xt,
                  i = arguments.length < 3;
                return n(e, Ji(t, 4), r, i, en);
              }),
              (Tr.repeat = function (e, t, r) {
                return (
                  (t = (r ? so(e, t, r) : void 0 === t) ? 1 : ns(t)),
                  zn(ss(e), t)
                );
              }),
              (Tr.replace = function () {
                var e = arguments,
                  t = ss(e[0]);
                return e.length < 3 ? t : t.replace(e[1], e[2]);
              }),
              (Tr.result = function (e, t, r) {
                var n = -1,
                  i = (t = si(t, e)).length;
                for (i || ((i = 1), (e = void 0)); ++n < i; ) {
                  var o = null == e ? void 0 : e[xo(t[n])];
                  void 0 === o && ((n = i), (o = r)),
                    (e = La(o) ? o.call(e) : o);
                }
                return e;
              }),
              (Tr.round = du),
              (Tr.runInContext = e),
              (Tr.sample = function (e) {
                return (Ba(e) ? qr : Un)(e);
              }),
              (Tr.size = function (e) {
                if (null == e) return 0;
                if (Ra(e)) return Ja(e) ? Kt(e) : e.length;
                var t = ro(e);
                return t == p || t == v ? e.size : En(e).length;
              }),
              (Tr.snakeCase = js),
              (Tr.some = function (e, t, r) {
                var n = Ba(e) ? bt : Vn;
                return r && so(e, t, r) && (t = void 0), n(e, Ji(t, 3));
              }),
              (Tr.sortedIndex = function (e, t) {
                return Gn(e, t);
              }),
              (Tr.sortedIndexBy = function (e, t, r) {
                return Xn(e, t, Ji(r, 2));
              }),
              (Tr.sortedIndexOf = function (e, t) {
                var r = null == e ? 0 : e.length;
                if (r) {
                  var n = Gn(e, t);
                  if (n < r && Ia(e[n], t)) return n;
                }
                return -1;
              }),
              (Tr.sortedLastIndex = function (e, t) {
                return Gn(e, t, !0);
              }),
              (Tr.sortedLastIndexBy = function (e, t, r) {
                return Xn(e, t, Ji(r, 2), !0);
              }),
              (Tr.sortedLastIndexOf = function (e, t) {
                if (null == e ? 0 : e.length) {
                  var r = Gn(e, t, !0) - 1;
                  if (Ia(e[r], t)) return r;
                }
                return -1;
              }),
              (Tr.startCase = zs),
              (Tr.startsWith = function (e, t, r) {
                return (
                  (e = ss(e)),
                  (r = null == r ? 0 : Xr(ns(r), 0, e.length)),
                  (t = Zn(t)),
                  e.slice(r, r + t.length) == t
                );
              }),
              (Tr.subtract = hu),
              (Tr.sum = function (e) {
                return e && e.length ? Tt(e, Vs) : 0;
              }),
              (Tr.sumBy = function (e, t) {
                return e && e.length ? Tt(e, Ji(t, 2)) : 0;
              }),
              (Tr.template = function (e, t, r) {
                var n = Tr.templateSettings;
                r && so(e, t, r) && (t = void 0),
                  (e = ss(e)),
                  (t = fs({}, t, n, Li));
                var i,
                  o,
                  a = fs({}, t.imports, n.imports, Li),
                  s = ws(a),
                  u = At(a, s),
                  c = 0,
                  f = t.interpolate || ce,
                  l = "__p += '",
                  d = be(
                    (t.escape || ce).source +
                      '|' +
                      f.source +
                      '|' +
                      (f === H ? te : ce).source +
                      '|' +
                      (t.evaluate || ce).source +
                      '|$',
                    'g'
                  ),
                  h =
                    '//# sourceURL=' +
                    (Ee.call(t, 'sourceURL')
                      ? (t.sourceURL + '').replace(/[\r\n]/g, ' ')
                      : 'lodash.templateSources[' + ++qe + ']') +
                    '\n';
                e.replace(d, function (t, r, n, a, s, u) {
                  return (
                    n || (n = a),
                    (l += e.slice(c, u).replace(fe, zt)),
                    r && ((i = !0), (l += "' +\n__e(" + r + ") +\n'")),
                    s && ((o = !0), (l += "';\n" + s + ";\n__p += '")),
                    n &&
                      (l +=
                        "' +\n((__t = (" + n + ")) == null ? '' : __t) +\n'"),
                    (c = u + t.length),
                    t
                  );
                }),
                  (l += "';\n");
                var p = Ee.call(t, 'variable') && t.variable;
                p || (l = 'with (obj) {\n' + l + '\n}\n'),
                  (l = (o ? l.replace(N, '') : l)
                    .replace(B, '$1')
                    .replace(C, '$1;')),
                  (l =
                    'function(' +
                    (p || 'obj') +
                    ') {\n' +
                    (p ? '' : 'obj || (obj = {});\n') +
                    "var __t, __p = ''" +
                    (i ? ', __e = _.escape' : '') +
                    (o
                      ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                      : ';\n') +
                    l +
                    'return __p\n}');
                var m = Hs(function () {
                  return he(s, h + 'return ' + l).apply(void 0, u);
                });
                if (((m.source = l), Ua(m))) throw m;
                return m;
              }),
              (Tr.times = function (e, t) {
                if ((e = ns(e)) < 1 || e > 9007199254740991) return [];
                var r = 4294967295,
                  n = ar(e, 4294967295);
                e -= 4294967295;
                for (var i = Ot(n, (t = Ji(t))); ++r < e; ) t(r);
                return i;
              }),
              (Tr.toFinite = rs),
              (Tr.toInteger = ns),
              (Tr.toLength = is),
              (Tr.toLower = function (e) {
                return ss(e).toLowerCase();
              }),
              (Tr.toNumber = os),
              (Tr.toSafeInteger = function (e) {
                return e
                  ? Xr(ns(e), -9007199254740991, 9007199254740991)
                  : 0 === e
                  ? e
                  : 0;
              }),
              (Tr.toString = ss),
              (Tr.toUpper = function (e) {
                return ss(e).toUpperCase();
              }),
              (Tr.trim = function (e, t, r) {
                if ((e = ss(e)) && (r || void 0 === t)) return e.replace(G, '');
                if (!e || !(t = Zn(t))) return e;
                var n = Wt(e),
                  i = Wt(t);
                return ci(n, Nt(n, i), Bt(n, i) + 1).join('');
              }),
              (Tr.trimEnd = function (e, t, r) {
                if ((e = ss(e)) && (r || void 0 === t)) return e.replace($, '');
                if (!e || !(t = Zn(t))) return e;
                var n = Wt(e);
                return ci(n, 0, Bt(n, Wt(t)) + 1).join('');
              }),
              (Tr.trimStart = function (e, t, r) {
                if ((e = ss(e)) && (r || void 0 === t)) return e.replace(X, '');
                if (!e || !(t = Zn(t))) return e;
                var n = Wt(e);
                return ci(n, Nt(n, Wt(t))).join('');
              }),
              (Tr.truncate = function (e, t) {
                var r = 30,
                  n = '...';
                if (Da(t)) {
                  var i = 'separator' in t ? t.separator : i;
                  (r = 'length' in t ? ns(t.length) : r),
                    (n = 'omission' in t ? Zn(t.omission) : n);
                }
                var o = (e = ss(e)).length;
                if (qt(e)) {
                  var a = Wt(e);
                  o = a.length;
                }
                if (r >= o) return e;
                var s = r - Kt(n);
                if (s < 1) return n;
                var u = a ? ci(a, 0, s).join('') : e.slice(0, s);
                if (void 0 === i) return u + n;
                if ((a && (s += u.length - s), Xa(i))) {
                  if (e.slice(s).search(i)) {
                    var c,
                      f = u;
                    for (
                      i.global || (i = be(i.source, ss(re.exec(i)) + 'g')),
                        i.lastIndex = 0;
                      (c = i.exec(f));

                    )
                      var l = c.index;
                    u = u.slice(0, void 0 === l ? s : l);
                  }
                } else if (e.indexOf(Zn(i), s) != s) {
                  var d = u.lastIndexOf(i);
                  d > -1 && (u = u.slice(0, d));
                }
                return u + n;
              }),
              (Tr.unescape = function (e) {
                return (e = ss(e)) && z.test(e) ? e.replace(R, Vt) : e;
              }),
              (Tr.uniqueId = function (e) {
                var t = ++ke;
                return ss(e) + t;
              }),
              (Tr.upperCase = qs),
              (Tr.upperFirst = Us),
              (Tr.each = sa),
              (Tr.eachRight = ua),
              (Tr.first = Ro),
              Js(
                Tr,
                ((fu = {}),
                un(Tr, function (e, t) {
                  Ee.call(Tr.prototype, t) || (fu[t] = e);
                }),
                fu),
                { chain: !1 }
              ),
              (Tr.VERSION = '4.17.15'),
              at(
                [
                  'bind',
                  'bindKey',
                  'curry',
                  'curryRight',
                  'partial',
                  'partialRight',
                ],
                function (e) {
                  Tr[e].placeholder = Tr;
                }
              ),
              at(['drop', 'take'], function (e, t) {
                (Pr.prototype[e] = function (r) {
                  r = void 0 === r ? 1 : or(ns(r), 0);
                  var n = this.__filtered__ && !t ? new Pr(this) : this.clone();
                  return (
                    n.__filtered__
                      ? (n.__takeCount__ = ar(r, n.__takeCount__))
                      : n.__views__.push({
                          size: ar(r, 4294967295),
                          type: e + (n.__dir__ < 0 ? 'Right' : ''),
                        }),
                    n
                  );
                }),
                  (Pr.prototype[e + 'Right'] = function (t) {
                    return this.reverse()[e](t).reverse();
                  });
              }),
              at(['filter', 'map', 'takeWhile'], function (e, t) {
                var r = t + 1,
                  n = 1 == r || 3 == r;
                Pr.prototype[e] = function (e) {
                  var t = this.clone();
                  return (
                    t.__iteratees__.push({ iteratee: Ji(e, 3), type: r }),
                    (t.__filtered__ = t.__filtered__ || n),
                    t
                  );
                };
              }),
              at(['head', 'last'], function (e, t) {
                var r = 'take' + (t ? 'Right' : '');
                Pr.prototype[e] = function () {
                  return this[r](1).value()[0];
                };
              }),
              at(['initial', 'tail'], function (e, t) {
                var r = 'drop' + (t ? '' : 'Right');
                Pr.prototype[e] = function () {
                  return this.__filtered__ ? new Pr(this) : this[r](1);
                };
              }),
              (Pr.prototype.compact = function () {
                return this.filter(Vs);
              }),
              (Pr.prototype.find = function (e) {
                return this.filter(e).head();
              }),
              (Pr.prototype.findLast = function (e) {
                return this.reverse().find(e);
              }),
              (Pr.prototype.invokeMap = qn(function (e, t) {
                return 'function' == typeof e
                  ? new Pr(this)
                  : this.map(function (r) {
                      return vn(r, e, t);
                    });
              })),
              (Pr.prototype.reject = function (e) {
                return this.filter(Ea(Ji(e)));
              }),
              (Pr.prototype.slice = function (e, t) {
                e = ns(e);
                var r = this;
                return r.__filtered__ && (e > 0 || t < 0)
                  ? new Pr(r)
                  : (e < 0 ? (r = r.takeRight(-e)) : e && (r = r.drop(e)),
                    void 0 !== t &&
                      (r = (t = ns(t)) < 0 ? r.dropRight(-t) : r.take(t - e)),
                    r);
              }),
              (Pr.prototype.takeRightWhile = function (e) {
                return this.reverse().takeWhile(e).reverse();
              }),
              (Pr.prototype.toArray = function () {
                return this.take(4294967295);
              }),
              un(Pr.prototype, function (e, t) {
                var r = /^(?:filter|find|map|reject)|While$/.test(t),
                  n = /^(?:head|last)$/.test(t),
                  i = Tr[n ? 'take' + ('last' == t ? 'Right' : '') : t],
                  o = n || /^find/.test(t);
                i &&
                  (Tr.prototype[t] = function () {
                    var t = this.__wrapped__,
                      a = n ? [1] : arguments,
                      s = t instanceof Pr,
                      u = a[0],
                      c = s || Ba(t),
                      f = function (e) {
                        var t = i.apply(Tr, ht([e], a));
                        return n && l ? t[0] : t;
                      };
                    c &&
                      r &&
                      'function' == typeof u &&
                      1 != u.length &&
                      (s = c = !1);
                    var l = this.__chain__,
                      d = !!this.__actions__.length,
                      h = o && !l,
                      p = s && !d;
                    if (!o && c) {
                      t = p ? t : new Pr(this);
                      var m = e.apply(t, a);
                      return (
                        m.__actions__.push({
                          func: ra,
                          args: [f],
                          thisArg: void 0,
                        }),
                        new Ar(m, l)
                      );
                    }
                    return h && p
                      ? e.apply(this, a)
                      : ((m = this.thru(f)),
                        h ? (n ? m.value()[0] : m.value()) : m);
                  });
              }),
              at(
                ['pop', 'push', 'shift', 'sort', 'splice', 'unshift'],
                function (e) {
                  var t = ye[e],
                    r = /^(?:push|sort|unshift)$/.test(e) ? 'tap' : 'thru',
                    n = /^(?:pop|shift)$/.test(e);
                  Tr.prototype[e] = function () {
                    var e = arguments;
                    if (n && !this.__chain__) {
                      var i = this.value();
                      return t.apply(Ba(i) ? i : [], e);
                    }
                    return this[r](function (r) {
                      return t.apply(Ba(r) ? r : [], e);
                    });
                  };
                }
              ),
              un(Pr.prototype, function (e, t) {
                var r = Tr[t];
                if (r) {
                  var n = r.name + '';
                  Ee.call(vr, n) || (vr[n] = []),
                    vr[n].push({ name: t, func: r });
                }
              }),
              (vr[Oi(void 0, 2).name] = [{ name: 'wrapper', func: void 0 }]),
              (Pr.prototype.clone = function () {
                var e = new Pr(this.__wrapped__);
                return (
                  (e.__actions__ = gi(this.__actions__)),
                  (e.__dir__ = this.__dir__),
                  (e.__filtered__ = this.__filtered__),
                  (e.__iteratees__ = gi(this.__iteratees__)),
                  (e.__takeCount__ = this.__takeCount__),
                  (e.__views__ = gi(this.__views__)),
                  e
                );
              }),
              (Pr.prototype.reverse = function () {
                if (this.__filtered__) {
                  var e = new Pr(this);
                  (e.__dir__ = -1), (e.__filtered__ = !0);
                } else (e = this.clone()).__dir__ *= -1;
                return e;
              }),
              (Pr.prototype.value = function () {
                var e = this.__wrapped__.value(),
                  t = this.__dir__,
                  r = Ba(e),
                  n = t < 0,
                  i = r ? e.length : 0,
                  o = (function (e, t, r) {
                    var n = -1,
                      i = r.length;
                    for (; ++n < i; ) {
                      var o = r[n],
                        a = o.size;
                      switch (o.type) {
                        case 'drop':
                          e += a;
                          break;
                        case 'dropRight':
                          t -= a;
                          break;
                        case 'take':
                          t = ar(t, e + a);
                          break;
                        case 'takeRight':
                          e = or(e, t - a);
                      }
                    }
                    return { start: e, end: t };
                  })(0, i, this.__views__),
                  a = o.start,
                  s = o.end,
                  u = s - a,
                  c = n ? s : a - 1,
                  f = this.__iteratees__,
                  l = f.length,
                  d = 0,
                  h = ar(u, this.__takeCount__);
                if (!r || (!n && i == u && h == u))
                  return ri(e, this.__actions__);
                var p = [];
                e: for (; u-- && d < h; ) {
                  for (var m = -1, b = e[(c += t)]; ++m < l; ) {
                    var g = f[m],
                      v = g.iteratee,
                      y = g.type,
                      w = v(b);
                    if (2 == y) b = w;
                    else if (!w) {
                      if (1 == y) continue e;
                      break e;
                    }
                  }
                  p[d++] = b;
                }
                return p;
              }),
              (Tr.prototype.at = na),
              (Tr.prototype.chain = function () {
                return ta(this);
              }),
              (Tr.prototype.commit = function () {
                return new Ar(this.value(), this.__chain__);
              }),
              (Tr.prototype.next = function () {
                void 0 === this.__values__ &&
                  (this.__values__ = ts(this.value()));
                var e = this.__index__ >= this.__values__.length;
                return {
                  done: e,
                  value: e ? void 0 : this.__values__[this.__index__++],
                };
              }),
              (Tr.prototype.plant = function (e) {
                for (var t, r = this; r instanceof Ir; ) {
                  var n = Oo(r);
                  (n.__index__ = 0),
                    (n.__values__ = void 0),
                    t ? (i.__wrapped__ = n) : (t = n);
                  var i = n;
                  r = r.__wrapped__;
                }
                return (i.__wrapped__ = e), t;
              }),
              (Tr.prototype.reverse = function () {
                var e = this.__wrapped__;
                if (e instanceof Pr) {
                  var t = e;
                  return (
                    this.__actions__.length && (t = new Pr(this)),
                    (t = t.reverse()).__actions__.push({
                      func: ra,
                      args: [Do],
                      thisArg: void 0,
                    }),
                    new Ar(t, this.__chain__)
                  );
                }
                return this.thru(Do);
              }),
              (Tr.prototype.toJSON = Tr.prototype.valueOf = Tr.prototype.value = function () {
                return ri(this.__wrapped__, this.__actions__);
              }),
              (Tr.prototype.first = Tr.prototype.head),
              gt &&
                (Tr.prototype[gt] = function () {
                  return this;
                }),
              Tr
            );
          })();
          (Ve._ = Gt),
            void 0 ===
              (n = function () {
                return Gt;
              }.call(t, r, t, e)) || (e.exports = n);
        }.call(this));
      }.call(this, r(42)(e)));
    },
    function (e, t, r) {
      'use strict';
      var n = t;
      function i(e) {
        return 1 === e.length ? '0' + e : e;
      }
      function o(e) {
        for (var t = '', r = 0; r < e.length; r++) t += i(e[r].toString(16));
        return t;
      }
      (n.toArray = function (e, t) {
        if (Array.isArray(e)) return e.slice();
        if (!e) return [];
        var r = [];
        if ('string' != typeof e) {
          for (var n = 0; n < e.length; n++) r[n] = 0 | e[n];
          return r;
        }
        if ('hex' === t) {
          (e = e.replace(/[^a-z0-9]+/gi, '')).length % 2 != 0 && (e = '0' + e);
          for (n = 0; n < e.length; n += 2)
            r.push(parseInt(e[n] + e[n + 1], 16));
        } else
          for (n = 0; n < e.length; n++) {
            var i = e.charCodeAt(n),
              o = i >> 8,
              a = 255 & i;
            o ? r.push(o, a) : r.push(a);
          }
        return r;
      }),
        (n.zero2 = i),
        (n.toHex = o),
        (n.encode = function (e, t) {
          return 'hex' === t ? o(e) : e;
        });
    },
    function (e, t, r) {
      var n;
      function i(e) {
        this.rand = e;
      }
      if (
        ((e.exports = function (e) {
          return n || (n = new i(null)), n.generate(e);
        }),
        (e.exports.Rand = i),
        (i.prototype.generate = function (e) {
          return this._rand(e);
        }),
        (i.prototype._rand = function (e) {
          if (this.rand.getBytes) return this.rand.getBytes(e);
          for (var t = new Uint8Array(e), r = 0; r < t.length; r++)
            t[r] = this.rand.getByte();
          return t;
        }),
        'object' == typeof self)
      )
        self.crypto && self.crypto.getRandomValues
          ? (i.prototype._rand = function (e) {
              var t = new Uint8Array(e);
              return self.crypto.getRandomValues(t), t;
            })
          : self.msCrypto && self.msCrypto.getRandomValues
          ? (i.prototype._rand = function (e) {
              var t = new Uint8Array(e);
              return self.msCrypto.getRandomValues(t), t;
            })
          : 'object' == typeof window &&
            (i.prototype._rand = function () {
              throw new Error('Not implemented yet');
            });
      else
        try {
          var o = r(2);
          if ('function' != typeof o.randomBytes)
            throw new Error('Not supported');
          i.prototype._rand = function (e) {
            return o.randomBytes(e);
          };
        } catch (e) {}
    },
    function (e, t, r) {
      'use strict';
      var n = t;
      (n.base = r(44)),
        (n.short = r(158)),
        (n.mont = r(160)),
        (n.edwards = r(161));
    },
    function (e, t, r) {
      'use strict';
      var n = r(15).rotr32;
      function i(e, t, r) {
        return (e & t) ^ (~e & r);
      }
      function o(e, t, r) {
        return (e & t) ^ (e & r) ^ (t & r);
      }
      function a(e, t, r) {
        return e ^ t ^ r;
      }
      (t.ft_1 = function (e, t, r, n) {
        return 0 === e
          ? i(t, r, n)
          : 1 === e || 3 === e
          ? a(t, r, n)
          : 2 === e
          ? o(t, r, n)
          : void 0;
      }),
        (t.ch32 = i),
        (t.maj32 = o),
        (t.p32 = a),
        (t.s0_256 = function (e) {
          return n(e, 2) ^ n(e, 13) ^ n(e, 22);
        }),
        (t.s1_256 = function (e) {
          return n(e, 6) ^ n(e, 11) ^ n(e, 25);
        }),
        (t.g0_256 = function (e) {
          return n(e, 7) ^ n(e, 18) ^ (e >>> 3);
        }),
        (t.g1_256 = function (e) {
          return n(e, 17) ^ n(e, 19) ^ (e >>> 10);
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(36),
        o = r(89),
        a = r(24),
        s = n.sum32,
        u = n.sum32_4,
        c = n.sum32_5,
        f = o.ch32,
        l = o.maj32,
        d = o.s0_256,
        h = o.s1_256,
        p = o.g0_256,
        m = o.g1_256,
        b = i.BlockHash,
        g = [
          1116352408,
          1899447441,
          3049323471,
          3921009573,
          961987163,
          1508970993,
          2453635748,
          2870763221,
          3624381080,
          310598401,
          607225278,
          1426881987,
          1925078388,
          2162078206,
          2614888103,
          3248222580,
          3835390401,
          4022224774,
          264347078,
          604807628,
          770255983,
          1249150122,
          1555081692,
          1996064986,
          2554220882,
          2821834349,
          2952996808,
          3210313671,
          3336571891,
          3584528711,
          113926993,
          338241895,
          666307205,
          773529912,
          1294757372,
          1396182291,
          1695183700,
          1986661051,
          2177026350,
          2456956037,
          2730485921,
          2820302411,
          3259730800,
          3345764771,
          3516065817,
          3600352804,
          4094571909,
          275423344,
          430227734,
          506948616,
          659060556,
          883997877,
          958139571,
          1322822218,
          1537002063,
          1747873779,
          1955562222,
          2024104815,
          2227730452,
          2361852424,
          2428436474,
          2756734187,
          3204031479,
          3329325298,
        ];
      function v() {
        if (!(this instanceof v)) return new v();
        b.call(this),
          (this.h = [
            1779033703,
            3144134277,
            1013904242,
            2773480762,
            1359893119,
            2600822924,
            528734635,
            1541459225,
          ]),
          (this.k = g),
          (this.W = new Array(64));
      }
      n.inherits(v, b),
        (e.exports = v),
        (v.blockSize = 512),
        (v.outSize = 256),
        (v.hmacStrength = 192),
        (v.padLength = 64),
        (v.prototype._update = function (e, t) {
          for (var r = this.W, n = 0; n < 16; n++) r[n] = e[t + n];
          for (; n < r.length; n++)
            r[n] = u(m(r[n - 2]), r[n - 7], p(r[n - 15]), r[n - 16]);
          var i = this.h[0],
            o = this.h[1],
            b = this.h[2],
            g = this.h[3],
            v = this.h[4],
            y = this.h[5],
            w = this.h[6],
            _ = this.h[7];
          for (a(this.k.length === r.length), n = 0; n < r.length; n++) {
            var S = c(_, h(v), f(v, y, w), this.k[n], r[n]),
              M = s(d(i), l(i, o, b));
            (_ = w),
              (w = y),
              (y = v),
              (v = s(g, S)),
              (g = b),
              (b = o),
              (o = i),
              (i = s(S, M));
          }
          (this.h[0] = s(this.h[0], i)),
            (this.h[1] = s(this.h[1], o)),
            (this.h[2] = s(this.h[2], b)),
            (this.h[3] = s(this.h[3], g)),
            (this.h[4] = s(this.h[4], v)),
            (this.h[5] = s(this.h[5], y)),
            (this.h[6] = s(this.h[6], w)),
            (this.h[7] = s(this.h[7], _));
        }),
        (v.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h, 'big')
            : n.split32(this.h, 'big');
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(36),
        o = r(24),
        a = n.rotr64_hi,
        s = n.rotr64_lo,
        u = n.shr64_hi,
        c = n.shr64_lo,
        f = n.sum64,
        l = n.sum64_hi,
        d = n.sum64_lo,
        h = n.sum64_4_hi,
        p = n.sum64_4_lo,
        m = n.sum64_5_hi,
        b = n.sum64_5_lo,
        g = i.BlockHash,
        v = [
          1116352408,
          3609767458,
          1899447441,
          602891725,
          3049323471,
          3964484399,
          3921009573,
          2173295548,
          961987163,
          4081628472,
          1508970993,
          3053834265,
          2453635748,
          2937671579,
          2870763221,
          3664609560,
          3624381080,
          2734883394,
          310598401,
          1164996542,
          607225278,
          1323610764,
          1426881987,
          3590304994,
          1925078388,
          4068182383,
          2162078206,
          991336113,
          2614888103,
          633803317,
          3248222580,
          3479774868,
          3835390401,
          2666613458,
          4022224774,
          944711139,
          264347078,
          2341262773,
          604807628,
          2007800933,
          770255983,
          1495990901,
          1249150122,
          1856431235,
          1555081692,
          3175218132,
          1996064986,
          2198950837,
          2554220882,
          3999719339,
          2821834349,
          766784016,
          2952996808,
          2566594879,
          3210313671,
          3203337956,
          3336571891,
          1034457026,
          3584528711,
          2466948901,
          113926993,
          3758326383,
          338241895,
          168717936,
          666307205,
          1188179964,
          773529912,
          1546045734,
          1294757372,
          1522805485,
          1396182291,
          2643833823,
          1695183700,
          2343527390,
          1986661051,
          1014477480,
          2177026350,
          1206759142,
          2456956037,
          344077627,
          2730485921,
          1290863460,
          2820302411,
          3158454273,
          3259730800,
          3505952657,
          3345764771,
          106217008,
          3516065817,
          3606008344,
          3600352804,
          1432725776,
          4094571909,
          1467031594,
          275423344,
          851169720,
          430227734,
          3100823752,
          506948616,
          1363258195,
          659060556,
          3750685593,
          883997877,
          3785050280,
          958139571,
          3318307427,
          1322822218,
          3812723403,
          1537002063,
          2003034995,
          1747873779,
          3602036899,
          1955562222,
          1575990012,
          2024104815,
          1125592928,
          2227730452,
          2716904306,
          2361852424,
          442776044,
          2428436474,
          593698344,
          2756734187,
          3733110249,
          3204031479,
          2999351573,
          3329325298,
          3815920427,
          3391569614,
          3928383900,
          3515267271,
          566280711,
          3940187606,
          3454069534,
          4118630271,
          4000239992,
          116418474,
          1914138554,
          174292421,
          2731055270,
          289380356,
          3203993006,
          460393269,
          320620315,
          685471733,
          587496836,
          852142971,
          1086792851,
          1017036298,
          365543100,
          1126000580,
          2618297676,
          1288033470,
          3409855158,
          1501505948,
          4234509866,
          1607167915,
          987167468,
          1816402316,
          1246189591,
        ];
      function y() {
        if (!(this instanceof y)) return new y();
        g.call(this),
          (this.h = [
            1779033703,
            4089235720,
            3144134277,
            2227873595,
            1013904242,
            4271175723,
            2773480762,
            1595750129,
            1359893119,
            2917565137,
            2600822924,
            725511199,
            528734635,
            4215389547,
            1541459225,
            327033209,
          ]),
          (this.k = v),
          (this.W = new Array(160));
      }
      function w(e, t, r, n, i) {
        var o = (e & r) ^ (~e & i);
        return o < 0 && (o += 4294967296), o;
      }
      function _(e, t, r, n, i, o) {
        var a = (t & n) ^ (~t & o);
        return a < 0 && (a += 4294967296), a;
      }
      function S(e, t, r, n, i) {
        var o = (e & r) ^ (e & i) ^ (r & i);
        return o < 0 && (o += 4294967296), o;
      }
      function M(e, t, r, n, i, o) {
        var a = (t & n) ^ (t & o) ^ (n & o);
        return a < 0 && (a += 4294967296), a;
      }
      function E(e, t) {
        var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
        return r < 0 && (r += 4294967296), r;
      }
      function k(e, t) {
        var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);
        return r < 0 && (r += 4294967296), r;
      }
      function x(e, t) {
        var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
        return r < 0 && (r += 4294967296), r;
      }
      function T(e, t) {
        var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);
        return r < 0 && (r += 4294967296), r;
      }
      function O(e, t) {
        var r = a(e, t, 1) ^ a(e, t, 8) ^ u(e, t, 7);
        return r < 0 && (r += 4294967296), r;
      }
      function I(e, t) {
        var r = s(e, t, 1) ^ s(e, t, 8) ^ c(e, t, 7);
        return r < 0 && (r += 4294967296), r;
      }
      function A(e, t) {
        var r = a(e, t, 19) ^ a(t, e, 29) ^ u(e, t, 6);
        return r < 0 && (r += 4294967296), r;
      }
      function P(e, t) {
        var r = s(e, t, 19) ^ s(t, e, 29) ^ c(e, t, 6);
        return r < 0 && (r += 4294967296), r;
      }
      n.inherits(y, g),
        (e.exports = y),
        (y.blockSize = 1024),
        (y.outSize = 512),
        (y.hmacStrength = 192),
        (y.padLength = 128),
        (y.prototype._prepareBlock = function (e, t) {
          for (var r = this.W, n = 0; n < 32; n++) r[n] = e[t + n];
          for (; n < r.length; n += 2) {
            var i = A(r[n - 4], r[n - 3]),
              o = P(r[n - 4], r[n - 3]),
              a = r[n - 14],
              s = r[n - 13],
              u = O(r[n - 30], r[n - 29]),
              c = I(r[n - 30], r[n - 29]),
              f = r[n - 32],
              l = r[n - 31];
            (r[n] = h(i, o, a, s, u, c, f, l)),
              (r[n + 1] = p(i, o, a, s, u, c, f, l));
          }
        }),
        (y.prototype._update = function (e, t) {
          this._prepareBlock(e, t);
          var r = this.W,
            n = this.h[0],
            i = this.h[1],
            a = this.h[2],
            s = this.h[3],
            u = this.h[4],
            c = this.h[5],
            h = this.h[6],
            p = this.h[7],
            g = this.h[8],
            v = this.h[9],
            y = this.h[10],
            O = this.h[11],
            I = this.h[12],
            A = this.h[13],
            P = this.h[14],
            N = this.h[15];
          o(this.k.length === r.length);
          for (var B = 0; B < r.length; B += 2) {
            var C = P,
              R = N,
              j = x(g, v),
              z = T(g, v),
              q = w(g, v, y, O, I),
              U = _(g, v, y, O, I, A),
              L = this.k[B],
              H = this.k[B + 1],
              F = r[B],
              D = r[B + 1],
              K = m(C, R, j, z, q, U, L, H, F, D),
              W = b(C, R, j, z, q, U, L, H, F, D);
            (C = E(n, i)),
              (R = k(n, i)),
              (j = S(n, i, a, s, u)),
              (z = M(n, i, a, s, u, c));
            var V = l(C, R, j, z),
              G = d(C, R, j, z);
            (P = I),
              (N = A),
              (I = y),
              (A = O),
              (y = g),
              (O = v),
              (g = l(h, p, K, W)),
              (v = d(p, p, K, W)),
              (h = u),
              (p = c),
              (u = a),
              (c = s),
              (a = n),
              (s = i),
              (n = l(K, W, V, G)),
              (i = d(K, W, V, G));
          }
          f(this.h, 0, n, i),
            f(this.h, 2, a, s),
            f(this.h, 4, u, c),
            f(this.h, 6, h, p),
            f(this.h, 8, g, v),
            f(this.h, 10, y, O),
            f(this.h, 12, I, A),
            f(this.h, 14, P, N);
        }),
        (y.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h, 'big')
            : n.split32(this.h, 'big');
        });
    },
    function (e, t, r) {
      'use strict';
      var n =
          (this && this.__awaiter) ||
          function (e, t, r, n) {
            return new (r || (r = Promise))(function (i, o) {
              function a(e) {
                try {
                  u(n.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function s(e) {
                try {
                  u(n.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function u(e) {
                var t;
                e.done
                  ? i(e.value)
                  : ((t = e.value),
                    t instanceof r
                      ? t
                      : new r(function (e) {
                          e(t);
                        })).then(a, s);
              }
              u((n = n.apply(e, t || [])).next());
            });
          },
        i =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
      Object.defineProperty(t, '__esModule', { value: !0 });
      const o = i(r(20)),
        a = r(176),
        s = r(177),
        u = r(85),
        c = r(43),
        f = r(178),
        l = r(53).ec,
        d = r(45),
        h = r(199),
        p = r(105),
        m = r(260);
      let b, g;
      const v = { account_number: '', sequence: 0 },
        y = [],
        w = new l('secp256k1');
      function _(e) {
        const t = c.hash('ripemd160', c.hash('sha256', Buffer.from(e, 'hex')));
        return d.encode('bluzelle', d.toWords(t));
      }
      (t.MAX_RETRIES = 10), (t.RETRY_INTERVAL = 1e3);
      function S(e, t, r) {
        o.default(!!t, 'Invalid transaction.'),
          (t.value.memo = (function (e) {
            const t =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            return u
              .range(0, e)
              .map(() => t[u.random(0, t.length - 1)])
              .join('');
          })(32));
        const n = (function (e, t, r) {
          var n, i;
          let o = {
            account_number: v.account_number || '0',
            chain_id: r,
            fee: c.sortJson(t.value.fee),
            memo: t.value.memo,
            msgs: c.sortJson(t.value.msg),
            sequence:
              (null === (n = v.sequence) || void 0 === n
                ? void 0
                : n.toString()) || '0',
          };
          const a = JSON.stringify(o).replace(
              /([&<>])/g,
              (e) => '\\u00' + e.charCodeAt(0).toString(16)
            ),
            s = c.hash('sha256', Buffer.from(a));
          return {
            pub_key: {
              type: 'tendermint/PubKeySecp256k1',
              value: Buffer.from(
                w.keyFromPrivate(e, 'hex').getPublic(!0, 'hex'),
                'hex'
              ).toString('base64'),
            },
            signature: c
              .convertSignature(w.sign(s, e, 'hex', { canonical: !0 }))
              .toString('base64'),
            account_number: v.account_number,
            sequence:
              null === (i = v.sequence) || void 0 === i ? void 0 : i.toString(),
          };
        })(g, t, r);
        return (
          (t.value.signatures = [n]),
          (t.value.signature = n),
          f
            .post(e + '/txs', {
              headers: { 'Content-type': 'application/json' },
              tx: t.value,
              mode: 'block',
            })
            .then((e) => e.data)
        );
      }
      function M(e) {
        return n(this, void 0, void 0, function* () {
          const r = `${b}/${e.ep}`,
            i = e.data.BaseReq.chain_id;
          let o, a;
          const s = {
            method: e.type,
            url: r,
            data: e.data,
            headers: { 'Content-type': 'application/json' },
          };
          try {
            (o = yield f(s)),
              e.max_gas &&
                parseInt(o.data.value.fee.gas) > e.max_gas &&
                (o.data.value.fee.gas = '' + e.max_gas),
              e.max_fee
                ? (o.data.value.fee.amount = [
                    { denom: 'ubnt', amount: '' + e.max_fee },
                  ])
                : e.gas_price &&
                  (o.data.value.fee.amount = [
                    {
                      denom: 'ubnt',
                      amount: '' + o.data.value.fee.gas * e.gas_price,
                    },
                  ]);
          } catch (t) {
            return e.deferred.reject(new Error(t.message)), void E();
          }
          try {
            a = yield S(b, o.data, i);
          } catch (t) {
            return e.deferred.reject(new Error(t.message)), void E();
          }
          a.code
            ? -1 !== a.raw_log.search('signature verification failed')
              ? (function e(r, i) {
                  i
                    ? setTimeout(
                        () =>
                          n(this, void 0, void 0, function* () {
                            (yield k()) ? yield M(r) : e(r, i - 1);
                          }),
                        t.RETRY_INTERVAL
                      )
                    : (r.deferred.reject(new Error('Invalid chain id')), E());
                })(e, t.MAX_RETRIES)
              : (e.deferred.reject(
                  new Error(
                    (function (e) {
                      const t = e.search(': ');
                      if (-1 == t) return e;
                      switch (e.substring(0, t)) {
                        case 'insufficient fee':
                          return e.substring(t + 2);
                      }
                      const r = e.indexOf(':', t + 1);
                      return e.substring(t + 2, r);
                    })(a.raw_log)
                  )
                ),
                E())
            : (v.sequence++, e.deferred.resolve(a.data), E());
        });
      }
      function E() {
        y.shift(), y.length && setTimeout(T, 0);
      }
      function k() {
        let e = `${b}/auth/accounts/${_(
          w.keyFromPrivate(g, 'hex').getPublic(!0, 'hex')
        )}`;
        return f.get(e).then(x);
      }
      function x(e) {
        var t, r;
        const { account_number: n, sequence: i } =
          (null ===
            (r =
              null === (t = null == e ? void 0 : e.data) || void 0 === t
                ? void 0
                : t.result) || void 0 === r
            ? void 0
            : r.value) || {};
        if (!u.isNumber(n) && !u.isNumber(i))
          throw 'not a number when it should be!!!!!';
        if (u.isNumber(n) && u.isNumber(i))
          return (
            (v.account_number = '' + n),
            v.sequence !== i && ((v.sequence = i), !0)
          );
        throw new Error('Unable to retrieve account information');
      }
      function T() {
        return M(y[0]);
      }
      (t.init = (e, t) =>
        n(void 0, void 0, void 0, function* () {
          return (
            (b = t),
            (g = yield (function (e) {
              return n(this, void 0, void 0, function* () {
                return m
                  .mnemonicToSeed(e)
                  .then((e) => p.fromSeed(e))
                  .then((e) => e.derivePath("m/44'/118'/0'/0/0"))
                  .then((e) =>
                    h.ECPair.fromPrivateKey(e.privateKey, { compressed: !1 })
                  )
                  .then((e) => {
                    var t;
                    return null === (t = e.privateKey) || void 0 === t
                      ? void 0
                      : t.toString('hex');
                  });
              });
            })(e)),
            yield k(),
            _(w.keyFromPrivate(g, 'hex').getPublic(!0, 'hex'))
          );
        })),
        (t.sendTransaction = (e, t, r, n) => {
          const i = new s.Deferred(),
            o = new a.Transaction(e, t, r, i);
          return (
            u.extend(
              o,
              (function ({ max_gas: e, max_fee: t, gas_price: r } = {}) {
                return {
                  max_gas: null == e ? void 0 : e.toString(),
                  max_fee: null == t ? void 0 : t.toString(),
                  gas_price: null == r ? void 0 : r.toString(),
                };
              })(n)
            ),
            y.push(o),
            1 === y.length && setTimeout(T, 0),
            i.promise
          );
        }),
        (t.query = (e) =>
          n(void 0, void 0, void 0, function* () {
            try {
              return yield f.get(`${b}/${e}`).then((e) => e.data);
            } catch (e) {
              if ('string' == typeof e.response.data)
                throw new Error(e.response.data);
              if ('string' != typeof e.response.data.error)
                throw new Error('An error occurred');
              try {
                const t = JSON.parse(e.response.data.error);
                throw new Error(t.message);
              } catch (t) {
                throw new Error(e.response.data.error);
              }
            }
          }));
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e, t) {
        return function () {
          for (var r = new Array(arguments.length), n = 0; n < r.length; n++)
            r[n] = arguments[n];
          return e.apply(t, r);
        };
      };
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e) {
        return !(!e || !e.__CANCEL__);
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(184),
        o = { 'Content-Type': 'application/x-www-form-urlencoded' };
      function a(e, t) {
        !n.isUndefined(e) &&
          n.isUndefined(e['Content-Type']) &&
          (e['Content-Type'] = t);
      }
      var s,
        u = {
          adapter:
            ('undefined' != typeof XMLHttpRequest
              ? (s = r(185))
              : 'undefined' != typeof process &&
                '[object process]' ===
                  Object.prototype.toString.call(process) &&
                (s = r(191)),
            s),
          transformRequest: [
            function (e, t) {
              return (
                i(t, 'Accept'),
                i(t, 'Content-Type'),
                n.isFormData(e) ||
                n.isArrayBuffer(e) ||
                n.isBuffer(e) ||
                n.isStream(e) ||
                n.isFile(e) ||
                n.isBlob(e)
                  ? e
                  : n.isArrayBufferView(e)
                  ? e.buffer
                  : n.isURLSearchParams(e)
                  ? (a(t, 'application/x-www-form-urlencoded;charset=utf-8'),
                    e.toString())
                  : n.isObject(e)
                  ? (a(t, 'application/json;charset=utf-8'), JSON.stringify(e))
                  : e
              );
            },
          ],
          transformResponse: [
            function (e) {
              if ('string' == typeof e)
                try {
                  e = JSON.parse(e);
                } catch (e) {}
              return e;
            },
          ],
          timeout: 0,
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN',
          maxContentLength: -1,
          validateStatus: function (e) {
            return e >= 200 && e < 300;
          },
        };
      (u.headers = { common: { Accept: 'application/json, text/plain, */*' } }),
        n.forEach(['delete', 'get', 'head'], function (e) {
          u.headers[e] = {};
        }),
        n.forEach(['post', 'put', 'patch'], function (e) {
          u.headers[e] = n.merge(o);
        }),
        (e.exports = u);
    },
    function (e, t, r) {
      'use strict';
      var n = r(57);
      e.exports = function (e, t, r) {
        var i = r.config.validateStatus;
        !i || i(r.status)
          ? e(r)
          : t(
              n(
                'Request failed with status code ' + r.status,
                r.config,
                null,
                r.request,
                r
              )
            );
      };
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e, t, r, n, i) {
        return (
          (e.config = t),
          r && (e.code = r),
          (e.request = n),
          (e.response = i),
          (e.isAxiosError = !0),
          (e.toJSON = function () {
            return {
              message: this.message,
              name: this.name,
              description: this.description,
              number: this.number,
              fileName: this.fileName,
              lineNumber: this.lineNumber,
              columnNumber: this.columnNumber,
              stack: this.stack,
              config: this.config,
              code: this.code,
            };
          }),
          e
        );
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(186),
        i = r(187);
      e.exports = function (e, t) {
        return e && !n(t) ? i(e, t) : t;
      };
    },
    function (e, t, r) {
      var n = r(17),
        i = r(26),
        o = r(29),
        a = r(20),
        s = r(22).Writable,
        u = r(192)('follow-redirects'),
        c = { GET: !0, HEAD: !0, OPTIONS: !0, TRACE: !0 },
        f = Object.create(null);
      function l(e, t) {
        s.call(this),
          (e.headers = e.headers || {}),
          (this._options = e),
          (this._redirectCount = 0),
          (this._redirects = []),
          (this._requestBodyLength = 0),
          (this._requestBodyBuffers = []),
          e.host && (e.hostname || (e.hostname = e.host), delete e.host),
          t && this.on('response', t);
        var r = this;
        if (
          ((this._onNativeResponse = function (e) {
            r._processResponse(e);
          }),
          !e.pathname && e.path)
        ) {
          var n = e.path.indexOf('?');
          n < 0
            ? (e.pathname = e.path)
            : ((e.pathname = e.path.substring(0, n)),
              (e.search = e.path.substring(n)));
        }
        this._performRequest();
      }
      function d(e) {
        var t = { maxRedirects: 21, maxBodyLength: 10485760 },
          r = {};
        return (
          Object.keys(e).forEach(function (i) {
            var o = i + ':',
              s = (r[o] = e[i]),
              c = (t[i] = Object.create(s));
            (c.request = function (e, i) {
              return (
                'string' == typeof e
                  ? ((e = n.parse(e)).maxRedirects = t.maxRedirects)
                  : (e = Object.assign(
                      {
                        protocol: o,
                        maxRedirects: t.maxRedirects,
                        maxBodyLength: t.maxBodyLength,
                      },
                      e
                    )),
                (e.nativeProtocols = r),
                a.equal(e.protocol, o, 'protocol mismatch'),
                u('options', e),
                new l(e, i)
              );
            }),
              (c.get = function (e, t) {
                var r = c.request(e, t);
                return r.end(), r;
              });
          }),
          t
        );
      }
      ['abort', 'aborted', 'error', 'socket', 'timeout'].forEach(function (e) {
        f[e] = function (t) {
          this._redirectable.emit(e, t);
        };
      }),
        (l.prototype = Object.create(s.prototype)),
        (l.prototype.write = function (e, t, r) {
          if (
            !('string' == typeof e || ('object' == typeof e && 'length' in e))
          )
            throw new Error('data should be a string, Buffer or Uint8Array');
          'function' == typeof t && ((r = t), (t = null)),
            0 !== e.length
              ? this._requestBodyLength + e.length <=
                this._options.maxBodyLength
                ? ((this._requestBodyLength += e.length),
                  this._requestBodyBuffers.push({ data: e, encoding: t }),
                  this._currentRequest.write(e, t, r))
                : (this.emit(
                    'error',
                    new Error('Request body larger than maxBodyLength limit')
                  ),
                  this.abort())
              : r && r();
        }),
        (l.prototype.end = function (e, t, r) {
          'function' == typeof e
            ? ((r = e), (e = t = null))
            : 'function' == typeof t && ((r = t), (t = null));
          var n = this._currentRequest;
          this.write(e || '', t, function () {
            n.end(null, null, r);
          });
        }),
        (l.prototype.setHeader = function (e, t) {
          (this._options.headers[e] = t), this._currentRequest.setHeader(e, t);
        }),
        (l.prototype.removeHeader = function (e) {
          delete this._options.headers[e], this._currentRequest.removeHeader(e);
        }),
        [
          'abort',
          'flushHeaders',
          'getHeader',
          'setNoDelay',
          'setSocketKeepAlive',
          'setTimeout',
        ].forEach(function (e) {
          l.prototype[e] = function (t, r) {
            return this._currentRequest[e](t, r);
          };
        }),
        ['aborted', 'connection', 'socket'].forEach(function (e) {
          Object.defineProperty(l.prototype, e, {
            get: function () {
              return this._currentRequest[e];
            },
          });
        }),
        (l.prototype._performRequest = function () {
          var e = this._options.protocol,
            t = this._options.nativeProtocols[e];
          if (t) {
            if (this._options.agents) {
              var r = e.substr(0, e.length - 1);
              this._options.agent = this._options.agents[r];
            }
            var i = (this._currentRequest = t.request(
              this._options,
              this._onNativeResponse
            ));
            for (var o in ((this._currentUrl = n.format(this._options)),
            (i._redirectable = this),
            f))
              o && i.on(o, f[o]);
            if (this._isRedirect) {
              var a = 0,
                s = this._requestBodyBuffers;
              !(function e() {
                if (a < s.length) {
                  var t = s[a++];
                  i.write(t.data, t.encoding, e);
                } else i.end();
              })();
            }
          } else this.emit('error', new Error('Unsupported protocol ' + e));
        }),
        (l.prototype._processResponse = function (e) {
          this._options.trackRedirects &&
            this._redirects.push({
              url: this._currentUrl,
              headers: e.headers,
              statusCode: e.statusCode,
            });
          var t = e.headers.location;
          if (
            t &&
            !1 !== this._options.followRedirects &&
            e.statusCode >= 300 &&
            e.statusCode < 400
          ) {
            if (++this._redirectCount > this._options.maxRedirects)
              return void this.emit(
                'error',
                new Error('Max redirects exceeded.')
              );
            var r,
              i = this._options.headers;
            if (307 !== e.statusCode && !(this._options.method in c))
              for (r in ((this._options.method = 'GET'),
              (this._requestBodyBuffers = []),
              i))
                /^content-/i.test(r) && delete i[r];
            if (!this._isRedirect)
              for (r in i) /^host$/i.test(r) && delete i[r];
            var o = n.resolve(this._currentUrl, t);
            u('redirecting to', o),
              Object.assign(this._options, n.parse(o)),
              (this._isRedirect = !0),
              this._performRequest(),
              e.destroy();
          } else
            (e.responseUrl = this._currentUrl),
              (e.redirects = this._redirects),
              this.emit('response', e),
              (this._requestBodyBuffers = []);
        }),
        (e.exports = d({ http: i, https: o })),
        (e.exports.wrap = d);
    },
    function (e, t, r) {
      function n(e) {
        var r;
        function n() {
          if (n.enabled) {
            var e = n,
              i = +new Date(),
              o = i - (r || i);
            (e.diff = o), (e.prev = r), (e.curr = i), (r = i);
            for (var a = new Array(arguments.length), s = 0; s < a.length; s++)
              a[s] = arguments[s];
            (a[0] = t.coerce(a[0])), 'string' != typeof a[0] && a.unshift('%O');
            var u = 0;
            (a[0] = a[0].replace(/%([a-zA-Z%])/g, function (r, n) {
              if ('%%' === r) return r;
              u++;
              var i = t.formatters[n];
              if ('function' == typeof i) {
                var o = a[u];
                (r = i.call(e, o)), a.splice(u, 1), u--;
              }
              return r;
            })),
              t.formatArgs.call(e, a);
            var c = n.log || t.log || console.log.bind(console);
            c.apply(e, a);
          }
        }
        return (
          (n.namespace = e),
          (n.enabled = t.enabled(e)),
          (n.useColors = t.useColors()),
          (n.color = (function (e) {
            var r,
              n = 0;
            for (r in e) (n = (n << 5) - n + e.charCodeAt(r)), (n |= 0);
            return t.colors[Math.abs(n) % t.colors.length];
          })(e)),
          (n.destroy = i),
          'function' == typeof t.init && t.init(n),
          t.instances.push(n),
          n
        );
      }
      function i() {
        var e = t.instances.indexOf(this);
        return -1 !== e && (t.instances.splice(e, 1), !0);
      }
      ((t = e.exports = n.debug = n.default = n).coerce = function (e) {
        return e instanceof Error ? e.stack || e.message : e;
      }),
        (t.disable = function () {
          t.enable('');
        }),
        (t.enable = function (e) {
          var r;
          t.save(e), (t.names = []), (t.skips = []);
          var n = ('string' == typeof e ? e : '').split(/[\s,]+/),
            i = n.length;
          for (r = 0; r < i; r++)
            n[r] &&
              ('-' === (e = n[r].replace(/\*/g, '.*?'))[0]
                ? t.skips.push(new RegExp('^' + e.substr(1) + '$'))
                : t.names.push(new RegExp('^' + e + '$')));
          for (r = 0; r < t.instances.length; r++) {
            var o = t.instances[r];
            o.enabled = t.enabled(o.namespace);
          }
        }),
        (t.enabled = function (e) {
          if ('*' === e[e.length - 1]) return !0;
          var r, n;
          for (r = 0, n = t.skips.length; r < n; r++)
            if (t.skips[r].test(e)) return !1;
          for (r = 0, n = t.names.length; r < n; r++)
            if (t.names[r].test(e)) return !0;
          return !1;
        }),
        (t.humanize = r(194)),
        (t.instances = []),
        (t.names = []),
        (t.skips = []),
        (t.formatters = {});
    },
    function (e, t) {
      e.exports = require('tty');
    },
    function (e, t, r) {
      'use strict';
      const n = r(121),
        i = r(122),
        { env: o } = process;
      let a;
      function s(e) {
        return (function (e) {
          return (
            0 !== e && {
              level: e,
              hasBasic: !0,
              has256: e >= 2,
              has16m: e >= 3,
            }
          );
        })(
          (function (e) {
            if (0 === a) return 0;
            if (i('color=16m') || i('color=full') || i('color=truecolor'))
              return 3;
            if (i('color=256')) return 2;
            if (e && !e.isTTY && void 0 === a) return 0;
            const t = a || 0;
            if ('dumb' === o.TERM) return t;
            if ('win32' === process.platform) {
              const e = n.release().split('.');
              return Number(process.versions.node.split('.')[0]) >= 8 &&
                Number(e[0]) >= 10 &&
                Number(e[2]) >= 10586
                ? Number(e[2]) >= 14931
                  ? 3
                  : 2
                : 1;
            }
            if ('CI' in o)
              return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(
                (e) => e in o
              ) || 'codeship' === o.CI_NAME
                ? 1
                : t;
            if ('TEAMCITY_VERSION' in o)
              return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(o.TEAMCITY_VERSION)
                ? 1
                : 0;
            if ('truecolor' === o.COLORTERM) return 3;
            if ('TERM_PROGRAM' in o) {
              const e = parseInt(
                (o.TERM_PROGRAM_VERSION || '').split('.')[0],
                10
              );
              switch (o.TERM_PROGRAM) {
                case 'iTerm.app':
                  return e >= 3 ? 3 : 2;
                case 'Apple_Terminal':
                  return 2;
              }
            }
            return /-256(color)?$/i.test(o.TERM)
              ? 2
              : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
                  o.TERM
                ) || 'COLORTERM' in o
              ? 1
              : t;
          })(e)
        );
      }
      i('no-color') || i('no-colors') || i('color=false') || i('color=never')
        ? (a = 0)
        : (i('color') || i('colors') || i('color=true') || i('color=always')) &&
          (a = 1),
        'FORCE_COLOR' in o &&
          (a =
            !0 === o.FORCE_COLOR || 'true' === o.FORCE_COLOR
              ? 1
              : !1 === o.FORCE_COLOR || 'false' === o.FORCE_COLOR
              ? 0
              : 0 === o.FORCE_COLOR.length
              ? 1
              : Math.min(parseInt(o.FORCE_COLOR, 10), 3)),
        (e.exports = {
          supportsColor: s,
          stdout: s(process.stdout),
          stderr: s(process.stderr),
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      e.exports = function (e, t) {
        t = t || {};
        var r = {},
          i = ['url', 'method', 'params', 'data'],
          o = ['headers', 'auth', 'proxy'],
          a = [
            'baseURL',
            'url',
            'transformRequest',
            'transformResponse',
            'paramsSerializer',
            'timeout',
            'withCredentials',
            'adapter',
            'responseType',
            'xsrfCookieName',
            'xsrfHeaderName',
            'onUploadProgress',
            'onDownloadProgress',
            'maxContentLength',
            'validateStatus',
            'maxRedirects',
            'httpAgent',
            'httpsAgent',
            'cancelToken',
            'socketPath',
          ];
        n.forEach(i, function (e) {
          void 0 !== t[e] && (r[e] = t[e]);
        }),
          n.forEach(o, function (i) {
            n.isObject(t[i])
              ? (r[i] = n.deepMerge(e[i], t[i]))
              : void 0 !== t[i]
              ? (r[i] = t[i])
              : n.isObject(e[i])
              ? (r[i] = n.deepMerge(e[i]))
              : void 0 !== e[i] && (r[i] = e[i]);
          }),
          n.forEach(a, function (n) {
            void 0 !== t[n] ? (r[n] = t[n]) : void 0 !== e[n] && (r[n] = e[n]);
          });
        var s = i.concat(o).concat(a),
          u = Object.keys(t).filter(function (e) {
            return -1 === s.indexOf(e);
          });
        return (
          n.forEach(u, function (n) {
            void 0 !== t[n] ? (r[n] = t[n]) : void 0 !== e[n] && (r[n] = e[n]);
          }),
          r
        );
      };
    },
    function (e, t, r) {
      'use strict';
      function n(e) {
        this.message = e;
      }
      (n.prototype.toString = function () {
        return 'Cancel' + (this.message ? ': ' + this.message : '');
      }),
        (n.prototype.__CANCEL__ = !0),
        (e.exports = n);
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      var n = r(200);
      (t.fromSeed = n.fromSeed),
        (t.fromBase58 = n.fromBase58),
        (t.fromPublicKey = n.fromPublicKey),
        (t.fromPrivateKey = n.fromPrivateKey);
    },
    function (e, t, r) {
      var n = r(59);
      function i(e) {
        return e.name || e.toString().match(/function (.*?)\s*\(/)[1];
      }
      function o(e) {
        return n.Nil(e) ? '' : i(e.constructor);
      }
      function a(e, t) {
        Error.captureStackTrace && Error.captureStackTrace(e, t);
      }
      function s(e) {
        return n.Function(e)
          ? e.toJSON
            ? e.toJSON()
            : i(e)
          : n.Array(e)
          ? 'Array'
          : e && n.Object(e)
          ? 'Object'
          : void 0 !== e
          ? e
          : '';
      }
      function u(e, t, r) {
        var i = (function (e) {
          return n.Function(e)
            ? ''
            : n.String(e)
            ? JSON.stringify(e)
            : e && n.Object(e)
            ? ''
            : e;
        })(t);
        return (
          'Expected ' +
          s(e) +
          ', got' +
          ('' !== r ? ' ' + r : '') +
          ('' !== i ? ' ' + i : '')
        );
      }
      function c(e, t, r) {
        (r = r || o(t)),
          (this.message = u(e, t, r)),
          a(this, c),
          (this.__type = e),
          (this.__value = t),
          (this.__valueTypeName = r);
      }
      function f(e, t, r, n, i) {
        e
          ? ((i = i || o(n)),
            (this.message = (function (e, t, r, n, i) {
              var o = '" of type ';
              return (
                'key' === t && (o = '" with key type '),
                u('property "' + s(r) + o + s(e), n, i)
              );
            })(e, r, t, n, i)))
          : (this.message = 'Unexpected property "' + t + '"'),
          a(this, c),
          (this.__label = r),
          (this.__property = t),
          (this.__type = e),
          (this.__value = n),
          (this.__valueTypeName = i);
      }
      (c.prototype = Object.create(Error.prototype)),
        (c.prototype.constructor = c),
        (f.prototype = Object.create(Error.prototype)),
        (f.prototype.constructor = c),
        (e.exports = {
          TfTypeError: c,
          TfPropertyTypeError: f,
          tfCustomError: function (e, t) {
            return new c(e, {}, t);
          },
          tfSubError: function (e, t, r) {
            return (
              e instanceof f
                ? ((t = t + '.' + e.__property),
                  (e = new f(
                    e.__type,
                    t,
                    e.__label,
                    e.__value,
                    e.__valueTypeName
                  )))
                : e instanceof c &&
                  (e = new f(e.__type, t, r, e.__value, e.__valueTypeName)),
              a(e),
              e
            );
          },
          tfJSON: s,
          getValueTypeName: o,
        });
    },
    function (e, t, r) {
      var n = r(37);
      function i(e, t) {
        if (void 0 !== t && e[0] !== t)
          throw new Error('Invalid network version');
        if (33 === e.length)
          return { version: e[0], privateKey: e.slice(1, 33), compressed: !1 };
        if (34 !== e.length) throw new Error('Invalid WIF length');
        if (1 !== e[33]) throw new Error('Invalid compression flag');
        return { version: e[0], privateKey: e.slice(1, 33), compressed: !0 };
      }
      function o(e, t, r) {
        var n = new Buffer(r ? 34 : 33);
        return n.writeUInt8(e, 0), t.copy(n, 1), r && (n[33] = 1), n;
      }
      e.exports = {
        decode: function (e, t) {
          return i(n.decode(e), t);
        },
        decodeRaw: i,
        encode: function (e, t, r) {
          return 'number' == typeof e
            ? n.encode(o(e, t, r))
            : n.encode(o(e.version, e.privateKey, e.compressed));
        },
        encodeRaw: o,
      };
    },
    function (e, t, r) {
      var n = r(16).Buffer;
      e.exports = {
        check: function (e) {
          if (e.length < 8) return !1;
          if (e.length > 72) return !1;
          if (48 !== e[0]) return !1;
          if (e[1] !== e.length - 2) return !1;
          if (2 !== e[2]) return !1;
          var t = e[3];
          if (0 === t) return !1;
          if (5 + t >= e.length) return !1;
          if (2 !== e[4 + t]) return !1;
          var r = e[5 + t];
          return (
            0 !== r &&
            6 + t + r === e.length &&
            !(128 & e[4]) &&
            !(t > 1 && 0 === e[4] && !(128 & e[5])) &&
            !(128 & e[t + 6]) &&
            !(r > 1 && 0 === e[t + 6] && !(128 & e[t + 7]))
          );
        },
        decode: function (e) {
          if (e.length < 8) throw new Error('DER sequence length is too short');
          if (e.length > 72) throw new Error('DER sequence length is too long');
          if (48 !== e[0]) throw new Error('Expected DER sequence');
          if (e[1] !== e.length - 2)
            throw new Error('DER sequence length is invalid');
          if (2 !== e[2]) throw new Error('Expected DER integer');
          var t = e[3];
          if (0 === t) throw new Error('R length is zero');
          if (5 + t >= e.length) throw new Error('R length is too long');
          if (2 !== e[4 + t]) throw new Error('Expected DER integer (2)');
          var r = e[5 + t];
          if (0 === r) throw new Error('S length is zero');
          if (6 + t + r !== e.length) throw new Error('S length is invalid');
          if (128 & e[4]) throw new Error('R value is negative');
          if (t > 1 && 0 === e[4] && !(128 & e[5]))
            throw new Error('R value excessively padded');
          if (128 & e[t + 6]) throw new Error('S value is negative');
          if (r > 1 && 0 === e[t + 6] && !(128 & e[t + 7]))
            throw new Error('S value excessively padded');
          return { r: e.slice(4, 4 + t), s: e.slice(6 + t) };
        },
        encode: function (e, t) {
          var r = e.length,
            i = t.length;
          if (0 === r) throw new Error('R length is zero');
          if (0 === i) throw new Error('S length is zero');
          if (r > 33) throw new Error('R length is too long');
          if (i > 33) throw new Error('S length is too long');
          if (128 & e[0]) throw new Error('R value is negative');
          if (128 & t[0]) throw new Error('S value is negative');
          if (r > 1 && 0 === e[0] && !(128 & e[1]))
            throw new Error('R value excessively padded');
          if (i > 1 && 0 === t[0] && !(128 & t[1]))
            throw new Error('S value excessively padded');
          var o = n.allocUnsafe(6 + r + i);
          return (
            (o[0] = 48),
            (o[1] = o.length - 2),
            (o[2] = 2),
            (o[3] = e.length),
            e.copy(o, 4),
            (o[4 + r] = 2),
            (o[5 + r] = t.length),
            t.copy(o, 6 + r),
            o
          );
        },
      };
    },
    function (e, t, r) {
      e.exports = r(2).randomBytes;
    },
    function (e, t, r) {
      'use strict';
      var n = r(16).Buffer;
      function i(e) {
        if (e < 0 || e > 9007199254740991 || e % 1 != 0)
          throw new RangeError('value out of range');
      }
      function o(e) {
        return i(e), e < 253 ? 1 : e <= 65535 ? 3 : e <= 4294967295 ? 5 : 9;
      }
      e.exports = {
        encode: function e(t, r, a) {
          if ((i(t), r || (r = n.allocUnsafe(o(t))), !n.isBuffer(r)))
            throw new TypeError('buffer must be a Buffer instance');
          return (
            a || (a = 0),
            t < 253
              ? (r.writeUInt8(t, a), (e.bytes = 1))
              : t <= 65535
              ? (r.writeUInt8(253, a), r.writeUInt16LE(t, a + 1), (e.bytes = 3))
              : t <= 4294967295
              ? (r.writeUInt8(254, a), r.writeUInt32LE(t, a + 1), (e.bytes = 5))
              : (r.writeUInt8(255, a),
                r.writeUInt32LE(t >>> 0, a + 1),
                r.writeUInt32LE((t / 4294967296) | 0, a + 5),
                (e.bytes = 9)),
            r
          );
        },
        decode: function e(t, r) {
          if (!n.isBuffer(t))
            throw new TypeError('buffer must be a Buffer instance');
          r || (r = 0);
          var o = t.readUInt8(r);
          if (o < 253) return (e.bytes = 1), o;
          if (253 === o) return (e.bytes = 3), t.readUInt16LE(r + 1);
          if (254 === o) return (e.bytes = 5), t.readUInt32LE(r + 1);
          e.bytes = 9;
          var a = t.readUInt32LE(r + 1),
            s = 4294967296 * t.readUInt32LE(r + 5) + a;
          return i(s), s;
        },
        encodingLength: o,
      };
    },
    function (e, t, r) {
      'use strict';
      function n(e) {
        for (var r in e) t.hasOwnProperty(r) || (t[r] = e[r]);
      }
      Object.defineProperty(t, '__esModule', { value: !0 }),
        n(r(227)),
        n(r(241));
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(63);
      function i(e, t) {
        const r = e[t];
        if (void 0 === r) throw new Error('No input #' + t);
        return r;
      }
      function o(e, t, r, n) {
        throw new Error(
          `Data for ${e} key ${t} is incorrect: Expected ${r} and got ${JSON.stringify(
            n
          )}`
        );
      }
      function a(e) {
        return (t, r) => {
          for (const i of Object.keys(t)) {
            const a = t[i],
              { canAdd: s, canAddToArray: u, check: c, expected: f } =
                n[e + 's'][i] || {},
              l = !!u;
            if (c)
              if (l) {
                if (!Array.isArray(a) || (r[i] && !Array.isArray(r[i])))
                  throw new Error(`Key type ${i} must be an array`);
                a.every(c) || o(e, i, f, a);
                const t = r[i] || [],
                  n = new Set();
                if (!a.every((e) => u(t, e, n)))
                  throw new Error('Can not add duplicate data to array');
                r[i] = t.concat(a);
              } else {
                if ((c(a) || o(e, i, f, a), !s(r, a)))
                  throw new Error('Can not add duplicate data to ' + e);
                r[i] = a;
              }
          }
        };
      }
      (t.checkForInput = i),
        (t.checkForOutput = function (e, t) {
          const r = e[t];
          if (void 0 === r) throw new Error('No output #' + t);
          return r;
        }),
        (t.checkHasKey = function (e, t, r) {
          if (e.key[0] < r)
            throw new Error(
              'Use the method for your specific key instead of addUnknownKeyVal*'
            );
          if (t && 0 !== t.filter((t) => t.key.equals(e.key)).length)
            throw new Error('Duplicate Key: ' + e.key.toString('hex'));
        }),
        (t.getEnumLength = function (e) {
          let t = 0;
          return (
            Object.keys(e).forEach((e) => {
              Number(isNaN(Number(e))) && t++;
            }),
            t
          );
        }),
        (t.inputCheckUncleanFinalized = function (e, t) {
          let r = !1;
          if (!t.nonWitnessUtxo != !t.witnessUtxo) {
            const e = !!t.redeemScript,
              n = !!t.witnessScript,
              i = !e || !!t.finalScriptSig,
              o = !n || !!t.finalScriptWitness,
              a = !!t.finalScriptSig || !!t.finalScriptWitness;
            r = i && o && a;
          }
          if (!1 === r)
            throw new Error(
              `Input #${e} has too much or too little data to clean`
            );
        }),
        (t.updateGlobal = a('global')),
        (t.updateInput = a('input')),
        (t.updateOutput = a('output')),
        (t.addInputAttributes = function (e, r) {
          const n = i(e, e.length - 1);
          t.updateInput(r, n);
        }),
        (t.addOutputAttributes = function (e, r) {
          const n = i(e, e.length - 1);
          t.updateOutput(r, n);
        }),
        (t.defaultVersionSetter = function (e, t) {
          if (!Buffer.isBuffer(t) || t.length < 4)
            throw new Error('Set Version: Invalid Transaction');
          return t.writeUInt32LE(e, 0), t;
        }),
        (t.defaultLocktimeSetter = function (e, t) {
          if (!Buffer.isBuffer(t) || t.length < 4)
            throw new Error('Set Locktime: Invalid Transaction');
          return t.writeUInt32LE(e, t.length - 4), t;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        const t = n.compile(e);
        return 22 === t.length && t[0] === i.OPS.OP_0 && 20 === t[1];
      }
      (t.check = o), (o.toJSON = () => 'Witness pubKeyHash output');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        const t = n.compile(e);
        return 34 === t.length && t[0] === i.OPS.OP_0 && 32 === t[1];
      }
      (t.check = o), (o.toJSON = () => 'Witness scriptHash output');
    },
    function (e, t, r) {
      var n = {
          md5: 16,
          sha1: 20,
          sha224: 28,
          sha256: 32,
          sha384: 48,
          sha512: 64,
          rmd160: 20,
          ripemd160: 20,
        },
        i = r(58),
        o = r(68),
        a = r(116),
        s = r(16).Buffer;
      e.exports = function (e, t, r, u, c) {
        o(e, t, r, u),
          s.isBuffer(e) || (e = s.from(e, a)),
          s.isBuffer(t) || (t = s.from(t, a)),
          (c = c || 'sha1');
        var f = s.allocUnsafe(u),
          l = s.allocUnsafe(t.length + 4);
        t.copy(l, 0, 0, t.length);
        for (var d = 0, h = n[c], p = Math.ceil(u / h), m = 1; m <= p; m++) {
          l.writeUInt32BE(m, t.length);
          for (var b = i(c, e).update(l).digest(), g = b, v = 1; v < r; v++) {
            g = i(c, e).update(g).digest();
            for (var y = 0; y < h; y++) b[y] ^= g[y];
          }
          b.copy(f, d), (d += h);
        }
        return f;
      };
    },
    function (e, t) {
      var r;
      process.browser
        ? (r = 'utf-8')
        : (r =
            parseInt(process.version.split('.')[0].slice(1), 10) >= 6
              ? 'utf-8'
              : 'binary');
      e.exports = r;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = {};
      let i;
      (t.wordlists = n), (t._default = i);
      try {
        (t._default = i = r(263)), (n.chinese_simplified = i);
      } catch (e) {}
      try {
        (t._default = i = r(264)), (n.chinese_traditional = i);
      } catch (e) {}
      try {
        (t._default = i = r(265)), (n.korean = i);
      } catch (e) {}
      try {
        (t._default = i = r(266)), (n.french = i);
      } catch (e) {}
      try {
        (t._default = i = r(267)), (n.italian = i);
      } catch (e) {}
      try {
        (t._default = i = r(268)), (n.spanish = i);
      } catch (e) {}
      try {
        (t._default = i = r(269)), (n.japanese = i), (n.JA = i);
      } catch (e) {}
      try {
        (t._default = i = r(270)), (n.english = i), (n.EN = i);
      } catch (e) {}
    },
    ,
    ,
    ,
    function (e, t) {
      e.exports = require('os');
    },
    function (e, t, r) {
      'use strict';
      e.exports = (e, t) => {
        t = t || process.argv;
        const r = e.startsWith('-') ? '' : 1 === e.length ? '-' : '--',
          n = t.indexOf(r + e),
          i = t.indexOf('--');
        return -1 !== n && (-1 === i || n < i);
      };
    },
    function (e, t, r) {
      const n = r(41),
        i = r(35);
      function o(e) {
        console.log('[dotenv][DEBUG] ' + e);
      }
      const a = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/,
        s = /\\n/g,
        u = /\n|\r|\r\n/;
      function c(e, t) {
        const r = Boolean(t && t.debug),
          n = {};
        return (
          e
            .toString()
            .split(u)
            .forEach(function (e, t) {
              const i = e.match(a);
              if (null != i) {
                const e = i[1];
                let t = i[2] || '';
                const r = t.length - 1,
                  o = '"' === t[0] && '"' === t[r];
                ("'" === t[0] && "'" === t[r]) || o
                  ? ((t = t.substring(1, r)), o && (t = t.replace(s, '\n')))
                  : (t = t.trim()),
                  (n[e] = t);
              } else r && o(`did not match key and value when parsing line ${t + 1}: ${e}`);
            }),
          n
        );
      }
      (e.exports.config = function (e) {
        let t = i.resolve(process.cwd(), '.env'),
          r = 'utf8',
          a = !1;
        e &&
          (null != e.path && (t = e.path),
          null != e.encoding && (r = e.encoding),
          null != e.debug && (a = !0));
        try {
          const e = c(n.readFileSync(t, { encoding: r }), { debug: a });
          return (
            Object.keys(e).forEach(function (t) {
              Object.prototype.hasOwnProperty.call(process.env, t)
                ? a &&
                  o(
                    `"${t}" is already defined in \`process.env\` and will not be overwritten`
                  )
                : (process.env[t] = e[t]);
            }),
            { parsed: e }
          );
        } catch (e) {
          return { error: e };
        }
      }),
        (e.exports.parse = c);
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function (e, t, r) {
      const { bluzelle: n } = r(155),
        {
          BLUZELLE_MNEMONIC: i,
          BLUZELLE_CHAIN_ID: o,
          BLUZELLE_ENDPOINT: a,
        } = r(78),
        s = { gas_price: 100, max_gas: 2e7, max_fee: 2e8 },
        u = { days: 7, hours: 0, minutes: 0, seconds: 0 };
      async function c(e) {
        const t = { uuid: e, mnemonic: i, endpoint: a, chain_id: o };
        return await n(t);
      }
      e.exports = {
        fetch: async function (e, t) {
          const r = await c(e);
          return await r.read(t);
        },
        save: async function (e, t, r) {
          const n = await c(e);
          return await n.create(t, r, s, u), await n.read(t);
        },
        fetchAll: async function (e) {
          const t = await c(e);
          return await t.keyValues();
        },
        keyExists: async function (e, t) {
          const r = await c(e);
          return await r.has(t);
        },
      };
    },
    function (e, t, r) {
      'use strict';
      var n =
        (this && this.__awaiter) ||
        function (e, t, r, n) {
          return new (r || (r = Promise))(function (i, o) {
            function a(e) {
              try {
                u(n.next(e));
              } catch (e) {
                o(e);
              }
            }
            function s(e) {
              try {
                u(n.throw(e));
              } catch (e) {
                o(e);
              }
            }
            function u(e) {
              var t;
              e.done
                ? i(e.value)
                : ((t = e.value),
                  t instanceof r
                    ? t
                    : new r(function (e) {
                        e(t);
                      })).then(a, s);
            }
            u((n = n.apply(e, t || [])).next());
          });
        };
      Object.defineProperty(t, '__esModule', { value: !0 });
      var i = r(84);
      t.API = i.API;
      const o = r(84);
      t.bluzelle = (e) =>
        n(void 0, void 0, void 0, function* () {
          const t = new o.API(e);
          return yield t.init(), t;
        });
    },
    function (e, t, r) {
      (function (e) {
        !(function (e, t) {
          'use strict';
          function n(e, t) {
            if (!e) throw new Error(t || 'Assertion failed');
          }
          function i(e, t) {
            e.super_ = t;
            var r = function () {};
            (r.prototype = t.prototype),
              (e.prototype = new r()),
              (e.prototype.constructor = e);
          }
          function o(e, t, r) {
            if (o.isBN(e)) return e;
            (this.negative = 0),
              (this.words = null),
              (this.length = 0),
              (this.red = null),
              null !== e &&
                (('le' !== t && 'be' !== t) || ((r = t), (t = 10)),
                this._init(e || 0, t || 10, r || 'be'));
          }
          var a;
          'object' == typeof e ? (e.exports = o) : (t.BN = o),
            (o.BN = o),
            (o.wordSize = 26);
          try {
            a = r(32).Buffer;
          } catch (e) {}
          function s(e, t, r) {
            for (
              var i = 0, o = Math.min(e.length, r), a = 0, s = t;
              s < o;
              s++
            ) {
              var u,
                c = e.charCodeAt(s) - 48;
              (i <<= 4),
                (i |= u =
                  c >= 49 && c <= 54
                    ? c - 49 + 10
                    : c >= 17 && c <= 22
                    ? c - 17 + 10
                    : c),
                (a |= u);
            }
            return n(!(240 & a), 'Invalid character in ' + e), i;
          }
          function u(e, t, r, i) {
            for (
              var o = 0, a = 0, s = Math.min(e.length, r), u = t;
              u < s;
              u++
            ) {
              var c = e.charCodeAt(u) - 48;
              (o *= i),
                (a = c >= 49 ? c - 49 + 10 : c >= 17 ? c - 17 + 10 : c),
                n(c >= 0 && a < i, 'Invalid character'),
                (o += a);
            }
            return o;
          }
          function c(e, t) {
            (e.words = t.words),
              (e.length = t.length),
              (e.negative = t.negative),
              (e.red = t.red);
          }
          function f() {
            return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
          }
          (o.isBN = function (e) {
            return (
              e instanceof o ||
              (null !== e &&
                'object' == typeof e &&
                e.constructor.wordSize === o.wordSize &&
                Array.isArray(e.words))
            );
          }),
            (o.max = function (e, t) {
              return e.cmp(t) > 0 ? e : t;
            }),
            (o.min = function (e, t) {
              return e.cmp(t) < 0 ? e : t;
            }),
            (o.prototype._init = function (e, t, r) {
              if ('number' == typeof e) return this._initNumber(e, t, r);
              if ('object' == typeof e) return this._initArray(e, t, r);
              'hex' === t && (t = 16), n(t === (0 | t) && t >= 2 && t <= 36);
              var i = 0;
              '-' === (e = e.toString().replace(/\s+/g, ''))[0] && i++,
                16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i),
                '-' === e[0] && (this.negative = 1),
                this._strip(),
                'le' === r && this._initArray(this.toArray(), t, r);
            }),
            (o.prototype._initNumber = function (e, t, r) {
              e < 0 && ((this.negative = 1), (e = -e)),
                e < 67108864
                  ? ((this.words = [67108863 & e]), (this.length = 1))
                  : e < 4503599627370496
                  ? ((this.words = [67108863 & e, (e / 67108864) & 67108863]),
                    (this.length = 2))
                  : (n(e < 9007199254740992),
                    (this.words = [67108863 & e, (e / 67108864) & 67108863, 1]),
                    (this.length = 3)),
                'le' === r && this._initArray(this.toArray(), t, r);
            }),
            (o.prototype._initArray = function (e, t, r) {
              if ((n('number' == typeof e.length), e.length <= 0))
                return (this.words = [0]), (this.length = 1), this;
              (this.length = Math.ceil(e.length / 3)),
                (this.words = new Array(this.length));
              for (var i = 0; i < this.length; i++) this.words[i] = 0;
              var o,
                a,
                s = 0;
              if ('be' === r)
                for (i = e.length - 1, o = 0; i >= 0; i -= 3)
                  (a = e[i] | (e[i - 1] << 8) | (e[i - 2] << 16)),
                    (this.words[o] |= (a << s) & 67108863),
                    (this.words[o + 1] = (a >>> (26 - s)) & 67108863),
                    (s += 24) >= 26 && ((s -= 26), o++);
              else if ('le' === r)
                for (i = 0, o = 0; i < e.length; i += 3)
                  (a = e[i] | (e[i + 1] << 8) | (e[i + 2] << 16)),
                    (this.words[o] |= (a << s) & 67108863),
                    (this.words[o + 1] = (a >>> (26 - s)) & 67108863),
                    (s += 24) >= 26 && ((s -= 26), o++);
              return this._strip();
            }),
            (o.prototype._parseHex = function (e, t) {
              (this.length = Math.ceil((e.length - t) / 6)),
                (this.words = new Array(this.length));
              for (var r = 0; r < this.length; r++) this.words[r] = 0;
              var n,
                i,
                o = 0;
              for (r = e.length - 6, n = 0; r >= t; r -= 6)
                (i = s(e, r, r + 6)),
                  (this.words[n] |= (i << o) & 67108863),
                  (this.words[n + 1] |= (i >>> (26 - o)) & 4194303),
                  (o += 24) >= 26 && ((o -= 26), n++);
              r + 6 !== t &&
                ((i = s(e, t, r + 6)),
                (this.words[n] |= (i << o) & 67108863),
                (this.words[n + 1] |= (i >>> (26 - o)) & 4194303)),
                this._strip();
            }),
            (o.prototype._parseBase = function (e, t, r) {
              (this.words = [0]), (this.length = 1);
              for (var n = 0, i = 1; i <= 67108863; i *= t) n++;
              n--, (i = (i / t) | 0);
              for (
                var o = e.length - r,
                  a = o % n,
                  s = Math.min(o, o - a) + r,
                  c = 0,
                  f = r;
                f < s;
                f += n
              )
                (c = u(e, f, f + n, t)),
                  this.imuln(i),
                  this.words[0] + c < 67108864
                    ? (this.words[0] += c)
                    : this._iaddn(c);
              if (0 !== a) {
                var l = 1;
                for (c = u(e, f, e.length, t), f = 0; f < a; f++) l *= t;
                this.imuln(l),
                  this.words[0] + c < 67108864
                    ? (this.words[0] += c)
                    : this._iaddn(c);
              }
            }),
            (o.prototype.copy = function (e) {
              e.words = new Array(this.length);
              for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
              (e.length = this.length),
                (e.negative = this.negative),
                (e.red = this.red);
            }),
            (o.prototype._move = function (e) {
              c(e, this);
            }),
            (o.prototype.clone = function () {
              var e = new o(null);
              return this.copy(e), e;
            }),
            (o.prototype._expand = function (e) {
              for (; this.length < e; ) this.words[this.length++] = 0;
              return this;
            }),
            (o.prototype._strip = function () {
              for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                this.length--;
              return this._normSign();
            }),
            (o.prototype._normSign = function () {
              return (
                1 === this.length && 0 === this.words[0] && (this.negative = 0),
                this
              );
            }),
            'undefined' != typeof Symbol && 'function' == typeof Symbol.for
              ? (o.prototype[Symbol.for('nodejs.util.inspect.custom')] = f)
              : (o.prototype.inspect = f);
          var l = [
              '',
              '0',
              '00',
              '000',
              '0000',
              '00000',
              '000000',
              '0000000',
              '00000000',
              '000000000',
              '0000000000',
              '00000000000',
              '000000000000',
              '0000000000000',
              '00000000000000',
              '000000000000000',
              '0000000000000000',
              '00000000000000000',
              '000000000000000000',
              '0000000000000000000',
              '00000000000000000000',
              '000000000000000000000',
              '0000000000000000000000',
              '00000000000000000000000',
              '000000000000000000000000',
              '0000000000000000000000000',
            ],
            d = [
              0,
              0,
              25,
              16,
              12,
              11,
              10,
              9,
              8,
              8,
              7,
              7,
              7,
              7,
              6,
              6,
              6,
              6,
              6,
              6,
              6,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
              5,
            ],
            h = [
              0,
              0,
              33554432,
              43046721,
              16777216,
              48828125,
              60466176,
              40353607,
              16777216,
              43046721,
              1e7,
              19487171,
              35831808,
              62748517,
              7529536,
              11390625,
              16777216,
              24137569,
              34012224,
              47045881,
              64e6,
              4084101,
              5153632,
              6436343,
              7962624,
              9765625,
              11881376,
              14348907,
              17210368,
              20511149,
              243e5,
              28629151,
              33554432,
              39135393,
              45435424,
              52521875,
              60466176,
            ];
          (o.prototype.toString = function (e, t) {
            var r;
            if (((t = 0 | t || 1), 16 === (e = e || 10) || 'hex' === e)) {
              r = '';
              for (var i = 0, o = 0, a = 0; a < this.length; a++) {
                var s = this.words[a],
                  u = (16777215 & ((s << i) | o)).toString(16);
                (r =
                  0 !== (o = (s >>> (24 - i)) & 16777215) ||
                  a !== this.length - 1
                    ? l[6 - u.length] + u + r
                    : u + r),
                  (i += 2) >= 26 && ((i -= 26), a--);
              }
              for (0 !== o && (r = o.toString(16) + r); r.length % t != 0; )
                r = '0' + r;
              return 0 !== this.negative && (r = '-' + r), r;
            }
            if (e === (0 | e) && e >= 2 && e <= 36) {
              var c = d[e],
                f = h[e];
              r = '';
              var p = this.clone();
              for (p.negative = 0; !p.isZero(); ) {
                var m = p.modrn(f).toString(e);
                r = (p = p.idivn(f)).isZero() ? m + r : l[c - m.length] + m + r;
              }
              for (this.isZero() && (r = '0' + r); r.length % t != 0; )
                r = '0' + r;
              return 0 !== this.negative && (r = '-' + r), r;
            }
            n(!1, 'Base should be between 2 and 36');
          }),
            (o.prototype.toNumber = function () {
              var e = this.words[0];
              return (
                2 === this.length
                  ? (e += 67108864 * this.words[1])
                  : 3 === this.length && 1 === this.words[2]
                  ? (e += 4503599627370496 + 67108864 * this.words[1])
                  : this.length > 2 &&
                    n(!1, 'Number can only safely store up to 53 bits'),
                0 !== this.negative ? -e : e
              );
            }),
            (o.prototype.toJSON = function () {
              return this.toString(16, 2);
            }),
            a &&
              (o.prototype.toBuffer = function (e, t) {
                return this.toArrayLike(a, e, t);
              }),
            (o.prototype.toArray = function (e, t) {
              return this.toArrayLike(Array, e, t);
            });
          function p(e, t, r) {
            r.negative = t.negative ^ e.negative;
            var n = (e.length + t.length) | 0;
            (r.length = n), (n = (n - 1) | 0);
            var i = 0 | e.words[0],
              o = 0 | t.words[0],
              a = i * o,
              s = 67108863 & a,
              u = (a / 67108864) | 0;
            r.words[0] = s;
            for (var c = 1; c < n; c++) {
              for (
                var f = u >>> 26,
                  l = 67108863 & u,
                  d = Math.min(c, t.length - 1),
                  h = Math.max(0, c - e.length + 1);
                h <= d;
                h++
              ) {
                var p = (c - h) | 0;
                (f +=
                  ((a = (i = 0 | e.words[p]) * (o = 0 | t.words[h]) + l) /
                    67108864) |
                  0),
                  (l = 67108863 & a);
              }
              (r.words[c] = 0 | l), (u = 0 | f);
            }
            return 0 !== u ? (r.words[c] = 0 | u) : r.length--, r._strip();
          }
          (o.prototype.toArrayLike = function (e, t, r) {
            this._strip();
            var i = this.byteLength(),
              o = r || Math.max(1, i);
            n(i <= o, 'byte array longer than desired length'),
              n(o > 0, 'Requested array length <= 0');
            var a = (function (e, t) {
              return e.allocUnsafe ? e.allocUnsafe(t) : new e(t);
            })(e, o);
            return this['_toArrayLike' + ('le' === t ? 'LE' : 'BE')](a, i), a;
          }),
            (o.prototype._toArrayLikeLE = function (e, t) {
              for (var r = 0, n = 0, i = 0, o = 0; i < this.length; i++) {
                var a = (this.words[i] << o) | n;
                (e[r++] = 255 & a),
                  r < e.length && (e[r++] = (a >> 8) & 255),
                  r < e.length && (e[r++] = (a >> 16) & 255),
                  6 === o
                    ? (r < e.length && (e[r++] = (a >> 24) & 255),
                      (n = 0),
                      (o = 0))
                    : ((n = a >>> 24), (o += 2));
              }
              if (r < e.length) for (e[r++] = n; r < e.length; ) e[r++] = 0;
            }),
            (o.prototype._toArrayLikeBE = function (e, t) {
              for (
                var r = e.length - 1, n = 0, i = 0, o = 0;
                i < this.length;
                i++
              ) {
                var a = (this.words[i] << o) | n;
                (e[r--] = 255 & a),
                  r >= 0 && (e[r--] = (a >> 8) & 255),
                  r >= 0 && (e[r--] = (a >> 16) & 255),
                  6 === o
                    ? (r >= 0 && (e[r--] = (a >> 24) & 255), (n = 0), (o = 0))
                    : ((n = a >>> 24), (o += 2));
              }
              if (r >= 0) for (e[r--] = n; r >= 0; ) e[r--] = 0;
            }),
            Math.clz32
              ? (o.prototype._countBits = function (e) {
                  return 32 - Math.clz32(e);
                })
              : (o.prototype._countBits = function (e) {
                  var t = e,
                    r = 0;
                  return (
                    t >= 4096 && ((r += 13), (t >>>= 13)),
                    t >= 64 && ((r += 7), (t >>>= 7)),
                    t >= 8 && ((r += 4), (t >>>= 4)),
                    t >= 2 && ((r += 2), (t >>>= 2)),
                    r + t
                  );
                }),
            (o.prototype._zeroBits = function (e) {
              if (0 === e) return 26;
              var t = e,
                r = 0;
              return (
                0 == (8191 & t) && ((r += 13), (t >>>= 13)),
                0 == (127 & t) && ((r += 7), (t >>>= 7)),
                0 == (15 & t) && ((r += 4), (t >>>= 4)),
                0 == (3 & t) && ((r += 2), (t >>>= 2)),
                0 == (1 & t) && r++,
                r
              );
            }),
            (o.prototype.bitLength = function () {
              var e = this.words[this.length - 1],
                t = this._countBits(e);
              return 26 * (this.length - 1) + t;
            }),
            (o.prototype.zeroBits = function () {
              if (this.isZero()) return 0;
              for (var e = 0, t = 0; t < this.length; t++) {
                var r = this._zeroBits(this.words[t]);
                if (((e += r), 26 !== r)) break;
              }
              return e;
            }),
            (o.prototype.byteLength = function () {
              return Math.ceil(this.bitLength() / 8);
            }),
            (o.prototype.toTwos = function (e) {
              return 0 !== this.negative
                ? this.abs().inotn(e).iaddn(1)
                : this.clone();
            }),
            (o.prototype.fromTwos = function (e) {
              return this.testn(e - 1)
                ? this.notn(e).iaddn(1).ineg()
                : this.clone();
            }),
            (o.prototype.isNeg = function () {
              return 0 !== this.negative;
            }),
            (o.prototype.neg = function () {
              return this.clone().ineg();
            }),
            (o.prototype.ineg = function () {
              return this.isZero() || (this.negative ^= 1), this;
            }),
            (o.prototype.iuor = function (e) {
              for (; this.length < e.length; ) this.words[this.length++] = 0;
              for (var t = 0; t < e.length; t++)
                this.words[t] = this.words[t] | e.words[t];
              return this._strip();
            }),
            (o.prototype.ior = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuor(e);
            }),
            (o.prototype.or = function (e) {
              return this.length > e.length
                ? this.clone().ior(e)
                : e.clone().ior(this);
            }),
            (o.prototype.uor = function (e) {
              return this.length > e.length
                ? this.clone().iuor(e)
                : e.clone().iuor(this);
            }),
            (o.prototype.iuand = function (e) {
              var t;
              t = this.length > e.length ? e : this;
              for (var r = 0; r < t.length; r++)
                this.words[r] = this.words[r] & e.words[r];
              return (this.length = t.length), this._strip();
            }),
            (o.prototype.iand = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuand(e);
            }),
            (o.prototype.and = function (e) {
              return this.length > e.length
                ? this.clone().iand(e)
                : e.clone().iand(this);
            }),
            (o.prototype.uand = function (e) {
              return this.length > e.length
                ? this.clone().iuand(e)
                : e.clone().iuand(this);
            }),
            (o.prototype.iuxor = function (e) {
              var t, r;
              this.length > e.length
                ? ((t = this), (r = e))
                : ((t = e), (r = this));
              for (var n = 0; n < r.length; n++)
                this.words[n] = t.words[n] ^ r.words[n];
              if (this !== t)
                for (; n < t.length; n++) this.words[n] = t.words[n];
              return (this.length = t.length), this._strip();
            }),
            (o.prototype.ixor = function (e) {
              return n(0 == (this.negative | e.negative)), this.iuxor(e);
            }),
            (o.prototype.xor = function (e) {
              return this.length > e.length
                ? this.clone().ixor(e)
                : e.clone().ixor(this);
            }),
            (o.prototype.uxor = function (e) {
              return this.length > e.length
                ? this.clone().iuxor(e)
                : e.clone().iuxor(this);
            }),
            (o.prototype.inotn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = 0 | Math.ceil(e / 26),
                r = e % 26;
              this._expand(t), r > 0 && t--;
              for (var i = 0; i < t; i++)
                this.words[i] = 67108863 & ~this.words[i];
              return (
                r > 0 &&
                  (this.words[i] = ~this.words[i] & (67108863 >> (26 - r))),
                this._strip()
              );
            }),
            (o.prototype.notn = function (e) {
              return this.clone().inotn(e);
            }),
            (o.prototype.setn = function (e, t) {
              n('number' == typeof e && e >= 0);
              var r = (e / 26) | 0,
                i = e % 26;
              return (
                this._expand(r + 1),
                (this.words[r] = t
                  ? this.words[r] | (1 << i)
                  : this.words[r] & ~(1 << i)),
                this._strip()
              );
            }),
            (o.prototype.iadd = function (e) {
              var t, r, n;
              if (0 !== this.negative && 0 === e.negative)
                return (
                  (this.negative = 0),
                  (t = this.isub(e)),
                  (this.negative ^= 1),
                  this._normSign()
                );
              if (0 === this.negative && 0 !== e.negative)
                return (
                  (e.negative = 0),
                  (t = this.isub(e)),
                  (e.negative = 1),
                  t._normSign()
                );
              this.length > e.length
                ? ((r = this), (n = e))
                : ((r = e), (n = this));
              for (var i = 0, o = 0; o < n.length; o++)
                (t = (0 | r.words[o]) + (0 | n.words[o]) + i),
                  (this.words[o] = 67108863 & t),
                  (i = t >>> 26);
              for (; 0 !== i && o < r.length; o++)
                (t = (0 | r.words[o]) + i),
                  (this.words[o] = 67108863 & t),
                  (i = t >>> 26);
              if (((this.length = r.length), 0 !== i))
                (this.words[this.length] = i), this.length++;
              else if (r !== this)
                for (; o < r.length; o++) this.words[o] = r.words[o];
              return this;
            }),
            (o.prototype.add = function (e) {
              var t;
              return 0 !== e.negative && 0 === this.negative
                ? ((e.negative = 0), (t = this.sub(e)), (e.negative ^= 1), t)
                : 0 === e.negative && 0 !== this.negative
                ? ((this.negative = 0),
                  (t = e.sub(this)),
                  (this.negative = 1),
                  t)
                : this.length > e.length
                ? this.clone().iadd(e)
                : e.clone().iadd(this);
            }),
            (o.prototype.isub = function (e) {
              if (0 !== e.negative) {
                e.negative = 0;
                var t = this.iadd(e);
                return (e.negative = 1), t._normSign();
              }
              if (0 !== this.negative)
                return (
                  (this.negative = 0),
                  this.iadd(e),
                  (this.negative = 1),
                  this._normSign()
                );
              var r,
                n,
                i = this.cmp(e);
              if (0 === i)
                return (
                  (this.negative = 0),
                  (this.length = 1),
                  (this.words[0] = 0),
                  this
                );
              i > 0 ? ((r = this), (n = e)) : ((r = e), (n = this));
              for (var o = 0, a = 0; a < n.length; a++)
                (o = (t = (0 | r.words[a]) - (0 | n.words[a]) + o) >> 26),
                  (this.words[a] = 67108863 & t);
              for (; 0 !== o && a < r.length; a++)
                (o = (t = (0 | r.words[a]) + o) >> 26),
                  (this.words[a] = 67108863 & t);
              if (0 === o && a < r.length && r !== this)
                for (; a < r.length; a++) this.words[a] = r.words[a];
              return (
                (this.length = Math.max(this.length, a)),
                r !== this && (this.negative = 1),
                this._strip()
              );
            }),
            (o.prototype.sub = function (e) {
              return this.clone().isub(e);
            });
          var m = function (e, t, r) {
            var n,
              i,
              o,
              a = e.words,
              s = t.words,
              u = r.words,
              c = 0,
              f = 0 | a[0],
              l = 8191 & f,
              d = f >>> 13,
              h = 0 | a[1],
              p = 8191 & h,
              m = h >>> 13,
              b = 0 | a[2],
              g = 8191 & b,
              v = b >>> 13,
              y = 0 | a[3],
              w = 8191 & y,
              _ = y >>> 13,
              S = 0 | a[4],
              M = 8191 & S,
              E = S >>> 13,
              k = 0 | a[5],
              x = 8191 & k,
              T = k >>> 13,
              O = 0 | a[6],
              I = 8191 & O,
              A = O >>> 13,
              P = 0 | a[7],
              N = 8191 & P,
              B = P >>> 13,
              C = 0 | a[8],
              R = 8191 & C,
              j = C >>> 13,
              z = 0 | a[9],
              q = 8191 & z,
              U = z >>> 13,
              L = 0 | s[0],
              H = 8191 & L,
              F = L >>> 13,
              D = 0 | s[1],
              K = 8191 & D,
              W = D >>> 13,
              V = 0 | s[2],
              G = 8191 & V,
              X = V >>> 13,
              $ = 0 | s[3],
              J = 8191 & $,
              Z = $ >>> 13,
              Y = 0 | s[4],
              Q = 8191 & Y,
              ee = Y >>> 13,
              te = 0 | s[5],
              re = 8191 & te,
              ne = te >>> 13,
              ie = 0 | s[6],
              oe = 8191 & ie,
              ae = ie >>> 13,
              se = 0 | s[7],
              ue = 8191 & se,
              ce = se >>> 13,
              fe = 0 | s[8],
              le = 8191 & fe,
              de = fe >>> 13,
              he = 0 | s[9],
              pe = 8191 & he,
              me = he >>> 13;
            (r.negative = e.negative ^ t.negative), (r.length = 19);
            var be =
              (((c + (n = Math.imul(l, H))) | 0) +
                ((8191 & (i = ((i = Math.imul(l, F)) + Math.imul(d, H)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = Math.imul(d, F)) + (i >>> 13)) | 0) + (be >>> 26)) | 0),
              (be &= 67108863),
              (n = Math.imul(p, H)),
              (i = ((i = Math.imul(p, F)) + Math.imul(m, H)) | 0),
              (o = Math.imul(m, F));
            var ge =
              (((c + (n = (n + Math.imul(l, K)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, W)) | 0) + Math.imul(d, K)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, W)) | 0) + (i >>> 13)) | 0) +
                (ge >>> 26)) |
              0),
              (ge &= 67108863),
              (n = Math.imul(g, H)),
              (i = ((i = Math.imul(g, F)) + Math.imul(v, H)) | 0),
              (o = Math.imul(v, F)),
              (n = (n + Math.imul(p, K)) | 0),
              (i = ((i = (i + Math.imul(p, W)) | 0) + Math.imul(m, K)) | 0),
              (o = (o + Math.imul(m, W)) | 0);
            var ve =
              (((c + (n = (n + Math.imul(l, G)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, X)) | 0) + Math.imul(d, G)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, X)) | 0) + (i >>> 13)) | 0) +
                (ve >>> 26)) |
              0),
              (ve &= 67108863),
              (n = Math.imul(w, H)),
              (i = ((i = Math.imul(w, F)) + Math.imul(_, H)) | 0),
              (o = Math.imul(_, F)),
              (n = (n + Math.imul(g, K)) | 0),
              (i = ((i = (i + Math.imul(g, W)) | 0) + Math.imul(v, K)) | 0),
              (o = (o + Math.imul(v, W)) | 0),
              (n = (n + Math.imul(p, G)) | 0),
              (i = ((i = (i + Math.imul(p, X)) | 0) + Math.imul(m, G)) | 0),
              (o = (o + Math.imul(m, X)) | 0);
            var ye =
              (((c + (n = (n + Math.imul(l, J)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, Z)) | 0) + Math.imul(d, J)) | 0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, Z)) | 0) + (i >>> 13)) | 0) +
                (ye >>> 26)) |
              0),
              (ye &= 67108863),
              (n = Math.imul(M, H)),
              (i = ((i = Math.imul(M, F)) + Math.imul(E, H)) | 0),
              (o = Math.imul(E, F)),
              (n = (n + Math.imul(w, K)) | 0),
              (i = ((i = (i + Math.imul(w, W)) | 0) + Math.imul(_, K)) | 0),
              (o = (o + Math.imul(_, W)) | 0),
              (n = (n + Math.imul(g, G)) | 0),
              (i = ((i = (i + Math.imul(g, X)) | 0) + Math.imul(v, G)) | 0),
              (o = (o + Math.imul(v, X)) | 0),
              (n = (n + Math.imul(p, J)) | 0),
              (i = ((i = (i + Math.imul(p, Z)) | 0) + Math.imul(m, J)) | 0),
              (o = (o + Math.imul(m, Z)) | 0);
            var we =
              (((c + (n = (n + Math.imul(l, Q)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ee)) | 0) + Math.imul(d, Q)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ee)) | 0) + (i >>> 13)) | 0) +
                (we >>> 26)) |
              0),
              (we &= 67108863),
              (n = Math.imul(x, H)),
              (i = ((i = Math.imul(x, F)) + Math.imul(T, H)) | 0),
              (o = Math.imul(T, F)),
              (n = (n + Math.imul(M, K)) | 0),
              (i = ((i = (i + Math.imul(M, W)) | 0) + Math.imul(E, K)) | 0),
              (o = (o + Math.imul(E, W)) | 0),
              (n = (n + Math.imul(w, G)) | 0),
              (i = ((i = (i + Math.imul(w, X)) | 0) + Math.imul(_, G)) | 0),
              (o = (o + Math.imul(_, X)) | 0),
              (n = (n + Math.imul(g, J)) | 0),
              (i = ((i = (i + Math.imul(g, Z)) | 0) + Math.imul(v, J)) | 0),
              (o = (o + Math.imul(v, Z)) | 0),
              (n = (n + Math.imul(p, Q)) | 0),
              (i = ((i = (i + Math.imul(p, ee)) | 0) + Math.imul(m, Q)) | 0),
              (o = (o + Math.imul(m, ee)) | 0);
            var _e =
              (((c + (n = (n + Math.imul(l, re)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ne)) | 0) + Math.imul(d, re)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ne)) | 0) + (i >>> 13)) | 0) +
                (_e >>> 26)) |
              0),
              (_e &= 67108863),
              (n = Math.imul(I, H)),
              (i = ((i = Math.imul(I, F)) + Math.imul(A, H)) | 0),
              (o = Math.imul(A, F)),
              (n = (n + Math.imul(x, K)) | 0),
              (i = ((i = (i + Math.imul(x, W)) | 0) + Math.imul(T, K)) | 0),
              (o = (o + Math.imul(T, W)) | 0),
              (n = (n + Math.imul(M, G)) | 0),
              (i = ((i = (i + Math.imul(M, X)) | 0) + Math.imul(E, G)) | 0),
              (o = (o + Math.imul(E, X)) | 0),
              (n = (n + Math.imul(w, J)) | 0),
              (i = ((i = (i + Math.imul(w, Z)) | 0) + Math.imul(_, J)) | 0),
              (o = (o + Math.imul(_, Z)) | 0),
              (n = (n + Math.imul(g, Q)) | 0),
              (i = ((i = (i + Math.imul(g, ee)) | 0) + Math.imul(v, Q)) | 0),
              (o = (o + Math.imul(v, ee)) | 0),
              (n = (n + Math.imul(p, re)) | 0),
              (i = ((i = (i + Math.imul(p, ne)) | 0) + Math.imul(m, re)) | 0),
              (o = (o + Math.imul(m, ne)) | 0);
            var Se =
              (((c + (n = (n + Math.imul(l, oe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ae)) | 0) + Math.imul(d, oe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ae)) | 0) + (i >>> 13)) | 0) +
                (Se >>> 26)) |
              0),
              (Se &= 67108863),
              (n = Math.imul(N, H)),
              (i = ((i = Math.imul(N, F)) + Math.imul(B, H)) | 0),
              (o = Math.imul(B, F)),
              (n = (n + Math.imul(I, K)) | 0),
              (i = ((i = (i + Math.imul(I, W)) | 0) + Math.imul(A, K)) | 0),
              (o = (o + Math.imul(A, W)) | 0),
              (n = (n + Math.imul(x, G)) | 0),
              (i = ((i = (i + Math.imul(x, X)) | 0) + Math.imul(T, G)) | 0),
              (o = (o + Math.imul(T, X)) | 0),
              (n = (n + Math.imul(M, J)) | 0),
              (i = ((i = (i + Math.imul(M, Z)) | 0) + Math.imul(E, J)) | 0),
              (o = (o + Math.imul(E, Z)) | 0),
              (n = (n + Math.imul(w, Q)) | 0),
              (i = ((i = (i + Math.imul(w, ee)) | 0) + Math.imul(_, Q)) | 0),
              (o = (o + Math.imul(_, ee)) | 0),
              (n = (n + Math.imul(g, re)) | 0),
              (i = ((i = (i + Math.imul(g, ne)) | 0) + Math.imul(v, re)) | 0),
              (o = (o + Math.imul(v, ne)) | 0),
              (n = (n + Math.imul(p, oe)) | 0),
              (i = ((i = (i + Math.imul(p, ae)) | 0) + Math.imul(m, oe)) | 0),
              (o = (o + Math.imul(m, ae)) | 0);
            var Me =
              (((c + (n = (n + Math.imul(l, ue)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, ce)) | 0) + Math.imul(d, ue)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, ce)) | 0) + (i >>> 13)) | 0) +
                (Me >>> 26)) |
              0),
              (Me &= 67108863),
              (n = Math.imul(R, H)),
              (i = ((i = Math.imul(R, F)) + Math.imul(j, H)) | 0),
              (o = Math.imul(j, F)),
              (n = (n + Math.imul(N, K)) | 0),
              (i = ((i = (i + Math.imul(N, W)) | 0) + Math.imul(B, K)) | 0),
              (o = (o + Math.imul(B, W)) | 0),
              (n = (n + Math.imul(I, G)) | 0),
              (i = ((i = (i + Math.imul(I, X)) | 0) + Math.imul(A, G)) | 0),
              (o = (o + Math.imul(A, X)) | 0),
              (n = (n + Math.imul(x, J)) | 0),
              (i = ((i = (i + Math.imul(x, Z)) | 0) + Math.imul(T, J)) | 0),
              (o = (o + Math.imul(T, Z)) | 0),
              (n = (n + Math.imul(M, Q)) | 0),
              (i = ((i = (i + Math.imul(M, ee)) | 0) + Math.imul(E, Q)) | 0),
              (o = (o + Math.imul(E, ee)) | 0),
              (n = (n + Math.imul(w, re)) | 0),
              (i = ((i = (i + Math.imul(w, ne)) | 0) + Math.imul(_, re)) | 0),
              (o = (o + Math.imul(_, ne)) | 0),
              (n = (n + Math.imul(g, oe)) | 0),
              (i = ((i = (i + Math.imul(g, ae)) | 0) + Math.imul(v, oe)) | 0),
              (o = (o + Math.imul(v, ae)) | 0),
              (n = (n + Math.imul(p, ue)) | 0),
              (i = ((i = (i + Math.imul(p, ce)) | 0) + Math.imul(m, ue)) | 0),
              (o = (o + Math.imul(m, ce)) | 0);
            var Ee =
              (((c + (n = (n + Math.imul(l, le)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, de)) | 0) + Math.imul(d, le)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, de)) | 0) + (i >>> 13)) | 0) +
                (Ee >>> 26)) |
              0),
              (Ee &= 67108863),
              (n = Math.imul(q, H)),
              (i = ((i = Math.imul(q, F)) + Math.imul(U, H)) | 0),
              (o = Math.imul(U, F)),
              (n = (n + Math.imul(R, K)) | 0),
              (i = ((i = (i + Math.imul(R, W)) | 0) + Math.imul(j, K)) | 0),
              (o = (o + Math.imul(j, W)) | 0),
              (n = (n + Math.imul(N, G)) | 0),
              (i = ((i = (i + Math.imul(N, X)) | 0) + Math.imul(B, G)) | 0),
              (o = (o + Math.imul(B, X)) | 0),
              (n = (n + Math.imul(I, J)) | 0),
              (i = ((i = (i + Math.imul(I, Z)) | 0) + Math.imul(A, J)) | 0),
              (o = (o + Math.imul(A, Z)) | 0),
              (n = (n + Math.imul(x, Q)) | 0),
              (i = ((i = (i + Math.imul(x, ee)) | 0) + Math.imul(T, Q)) | 0),
              (o = (o + Math.imul(T, ee)) | 0),
              (n = (n + Math.imul(M, re)) | 0),
              (i = ((i = (i + Math.imul(M, ne)) | 0) + Math.imul(E, re)) | 0),
              (o = (o + Math.imul(E, ne)) | 0),
              (n = (n + Math.imul(w, oe)) | 0),
              (i = ((i = (i + Math.imul(w, ae)) | 0) + Math.imul(_, oe)) | 0),
              (o = (o + Math.imul(_, ae)) | 0),
              (n = (n + Math.imul(g, ue)) | 0),
              (i = ((i = (i + Math.imul(g, ce)) | 0) + Math.imul(v, ue)) | 0),
              (o = (o + Math.imul(v, ce)) | 0),
              (n = (n + Math.imul(p, le)) | 0),
              (i = ((i = (i + Math.imul(p, de)) | 0) + Math.imul(m, le)) | 0),
              (o = (o + Math.imul(m, de)) | 0);
            var ke =
              (((c + (n = (n + Math.imul(l, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(l, me)) | 0) + Math.imul(d, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(d, me)) | 0) + (i >>> 13)) | 0) +
                (ke >>> 26)) |
              0),
              (ke &= 67108863),
              (n = Math.imul(q, K)),
              (i = ((i = Math.imul(q, W)) + Math.imul(U, K)) | 0),
              (o = Math.imul(U, W)),
              (n = (n + Math.imul(R, G)) | 0),
              (i = ((i = (i + Math.imul(R, X)) | 0) + Math.imul(j, G)) | 0),
              (o = (o + Math.imul(j, X)) | 0),
              (n = (n + Math.imul(N, J)) | 0),
              (i = ((i = (i + Math.imul(N, Z)) | 0) + Math.imul(B, J)) | 0),
              (o = (o + Math.imul(B, Z)) | 0),
              (n = (n + Math.imul(I, Q)) | 0),
              (i = ((i = (i + Math.imul(I, ee)) | 0) + Math.imul(A, Q)) | 0),
              (o = (o + Math.imul(A, ee)) | 0),
              (n = (n + Math.imul(x, re)) | 0),
              (i = ((i = (i + Math.imul(x, ne)) | 0) + Math.imul(T, re)) | 0),
              (o = (o + Math.imul(T, ne)) | 0),
              (n = (n + Math.imul(M, oe)) | 0),
              (i = ((i = (i + Math.imul(M, ae)) | 0) + Math.imul(E, oe)) | 0),
              (o = (o + Math.imul(E, ae)) | 0),
              (n = (n + Math.imul(w, ue)) | 0),
              (i = ((i = (i + Math.imul(w, ce)) | 0) + Math.imul(_, ue)) | 0),
              (o = (o + Math.imul(_, ce)) | 0),
              (n = (n + Math.imul(g, le)) | 0),
              (i = ((i = (i + Math.imul(g, de)) | 0) + Math.imul(v, le)) | 0),
              (o = (o + Math.imul(v, de)) | 0);
            var xe =
              (((c + (n = (n + Math.imul(p, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(p, me)) | 0) + Math.imul(m, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(m, me)) | 0) + (i >>> 13)) | 0) +
                (xe >>> 26)) |
              0),
              (xe &= 67108863),
              (n = Math.imul(q, G)),
              (i = ((i = Math.imul(q, X)) + Math.imul(U, G)) | 0),
              (o = Math.imul(U, X)),
              (n = (n + Math.imul(R, J)) | 0),
              (i = ((i = (i + Math.imul(R, Z)) | 0) + Math.imul(j, J)) | 0),
              (o = (o + Math.imul(j, Z)) | 0),
              (n = (n + Math.imul(N, Q)) | 0),
              (i = ((i = (i + Math.imul(N, ee)) | 0) + Math.imul(B, Q)) | 0),
              (o = (o + Math.imul(B, ee)) | 0),
              (n = (n + Math.imul(I, re)) | 0),
              (i = ((i = (i + Math.imul(I, ne)) | 0) + Math.imul(A, re)) | 0),
              (o = (o + Math.imul(A, ne)) | 0),
              (n = (n + Math.imul(x, oe)) | 0),
              (i = ((i = (i + Math.imul(x, ae)) | 0) + Math.imul(T, oe)) | 0),
              (o = (o + Math.imul(T, ae)) | 0),
              (n = (n + Math.imul(M, ue)) | 0),
              (i = ((i = (i + Math.imul(M, ce)) | 0) + Math.imul(E, ue)) | 0),
              (o = (o + Math.imul(E, ce)) | 0),
              (n = (n + Math.imul(w, le)) | 0),
              (i = ((i = (i + Math.imul(w, de)) | 0) + Math.imul(_, le)) | 0),
              (o = (o + Math.imul(_, de)) | 0);
            var Te =
              (((c + (n = (n + Math.imul(g, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(g, me)) | 0) + Math.imul(v, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(v, me)) | 0) + (i >>> 13)) | 0) +
                (Te >>> 26)) |
              0),
              (Te &= 67108863),
              (n = Math.imul(q, J)),
              (i = ((i = Math.imul(q, Z)) + Math.imul(U, J)) | 0),
              (o = Math.imul(U, Z)),
              (n = (n + Math.imul(R, Q)) | 0),
              (i = ((i = (i + Math.imul(R, ee)) | 0) + Math.imul(j, Q)) | 0),
              (o = (o + Math.imul(j, ee)) | 0),
              (n = (n + Math.imul(N, re)) | 0),
              (i = ((i = (i + Math.imul(N, ne)) | 0) + Math.imul(B, re)) | 0),
              (o = (o + Math.imul(B, ne)) | 0),
              (n = (n + Math.imul(I, oe)) | 0),
              (i = ((i = (i + Math.imul(I, ae)) | 0) + Math.imul(A, oe)) | 0),
              (o = (o + Math.imul(A, ae)) | 0),
              (n = (n + Math.imul(x, ue)) | 0),
              (i = ((i = (i + Math.imul(x, ce)) | 0) + Math.imul(T, ue)) | 0),
              (o = (o + Math.imul(T, ce)) | 0),
              (n = (n + Math.imul(M, le)) | 0),
              (i = ((i = (i + Math.imul(M, de)) | 0) + Math.imul(E, le)) | 0),
              (o = (o + Math.imul(E, de)) | 0);
            var Oe =
              (((c + (n = (n + Math.imul(w, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(w, me)) | 0) + Math.imul(_, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(_, me)) | 0) + (i >>> 13)) | 0) +
                (Oe >>> 26)) |
              0),
              (Oe &= 67108863),
              (n = Math.imul(q, Q)),
              (i = ((i = Math.imul(q, ee)) + Math.imul(U, Q)) | 0),
              (o = Math.imul(U, ee)),
              (n = (n + Math.imul(R, re)) | 0),
              (i = ((i = (i + Math.imul(R, ne)) | 0) + Math.imul(j, re)) | 0),
              (o = (o + Math.imul(j, ne)) | 0),
              (n = (n + Math.imul(N, oe)) | 0),
              (i = ((i = (i + Math.imul(N, ae)) | 0) + Math.imul(B, oe)) | 0),
              (o = (o + Math.imul(B, ae)) | 0),
              (n = (n + Math.imul(I, ue)) | 0),
              (i = ((i = (i + Math.imul(I, ce)) | 0) + Math.imul(A, ue)) | 0),
              (o = (o + Math.imul(A, ce)) | 0),
              (n = (n + Math.imul(x, le)) | 0),
              (i = ((i = (i + Math.imul(x, de)) | 0) + Math.imul(T, le)) | 0),
              (o = (o + Math.imul(T, de)) | 0);
            var Ie =
              (((c + (n = (n + Math.imul(M, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(M, me)) | 0) + Math.imul(E, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(E, me)) | 0) + (i >>> 13)) | 0) +
                (Ie >>> 26)) |
              0),
              (Ie &= 67108863),
              (n = Math.imul(q, re)),
              (i = ((i = Math.imul(q, ne)) + Math.imul(U, re)) | 0),
              (o = Math.imul(U, ne)),
              (n = (n + Math.imul(R, oe)) | 0),
              (i = ((i = (i + Math.imul(R, ae)) | 0) + Math.imul(j, oe)) | 0),
              (o = (o + Math.imul(j, ae)) | 0),
              (n = (n + Math.imul(N, ue)) | 0),
              (i = ((i = (i + Math.imul(N, ce)) | 0) + Math.imul(B, ue)) | 0),
              (o = (o + Math.imul(B, ce)) | 0),
              (n = (n + Math.imul(I, le)) | 0),
              (i = ((i = (i + Math.imul(I, de)) | 0) + Math.imul(A, le)) | 0),
              (o = (o + Math.imul(A, de)) | 0);
            var Ae =
              (((c + (n = (n + Math.imul(x, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(x, me)) | 0) + Math.imul(T, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(T, me)) | 0) + (i >>> 13)) | 0) +
                (Ae >>> 26)) |
              0),
              (Ae &= 67108863),
              (n = Math.imul(q, oe)),
              (i = ((i = Math.imul(q, ae)) + Math.imul(U, oe)) | 0),
              (o = Math.imul(U, ae)),
              (n = (n + Math.imul(R, ue)) | 0),
              (i = ((i = (i + Math.imul(R, ce)) | 0) + Math.imul(j, ue)) | 0),
              (o = (o + Math.imul(j, ce)) | 0),
              (n = (n + Math.imul(N, le)) | 0),
              (i = ((i = (i + Math.imul(N, de)) | 0) + Math.imul(B, le)) | 0),
              (o = (o + Math.imul(B, de)) | 0);
            var Pe =
              (((c + (n = (n + Math.imul(I, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(I, me)) | 0) + Math.imul(A, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(A, me)) | 0) + (i >>> 13)) | 0) +
                (Pe >>> 26)) |
              0),
              (Pe &= 67108863),
              (n = Math.imul(q, ue)),
              (i = ((i = Math.imul(q, ce)) + Math.imul(U, ue)) | 0),
              (o = Math.imul(U, ce)),
              (n = (n + Math.imul(R, le)) | 0),
              (i = ((i = (i + Math.imul(R, de)) | 0) + Math.imul(j, le)) | 0),
              (o = (o + Math.imul(j, de)) | 0);
            var Ne =
              (((c + (n = (n + Math.imul(N, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(N, me)) | 0) + Math.imul(B, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(B, me)) | 0) + (i >>> 13)) | 0) +
                (Ne >>> 26)) |
              0),
              (Ne &= 67108863),
              (n = Math.imul(q, le)),
              (i = ((i = Math.imul(q, de)) + Math.imul(U, le)) | 0),
              (o = Math.imul(U, de));
            var Be =
              (((c + (n = (n + Math.imul(R, pe)) | 0)) | 0) +
                ((8191 &
                  (i =
                    ((i = (i + Math.imul(R, me)) | 0) + Math.imul(j, pe)) |
                    0)) <<
                  13)) |
              0;
            (c =
              ((((o = (o + Math.imul(j, me)) | 0) + (i >>> 13)) | 0) +
                (Be >>> 26)) |
              0),
              (Be &= 67108863);
            var Ce =
              (((c + (n = Math.imul(q, pe))) | 0) +
                ((8191 &
                  (i = ((i = Math.imul(q, me)) + Math.imul(U, pe)) | 0)) <<
                  13)) |
              0;
            return (
              (c =
                ((((o = Math.imul(U, me)) + (i >>> 13)) | 0) + (Ce >>> 26)) |
                0),
              (Ce &= 67108863),
              (u[0] = be),
              (u[1] = ge),
              (u[2] = ve),
              (u[3] = ye),
              (u[4] = we),
              (u[5] = _e),
              (u[6] = Se),
              (u[7] = Me),
              (u[8] = Ee),
              (u[9] = ke),
              (u[10] = xe),
              (u[11] = Te),
              (u[12] = Oe),
              (u[13] = Ie),
              (u[14] = Ae),
              (u[15] = Pe),
              (u[16] = Ne),
              (u[17] = Be),
              (u[18] = Ce),
              0 !== c && ((u[19] = c), r.length++),
              r
            );
          };
          function b(e, t, r) {
            (r.negative = t.negative ^ e.negative),
              (r.length = e.length + t.length);
            for (var n = 0, i = 0, o = 0; o < r.length - 1; o++) {
              var a = i;
              i = 0;
              for (
                var s = 67108863 & n,
                  u = Math.min(o, t.length - 1),
                  c = Math.max(0, o - e.length + 1);
                c <= u;
                c++
              ) {
                var f = o - c,
                  l = (0 | e.words[f]) * (0 | t.words[c]),
                  d = 67108863 & l;
                (s = 67108863 & (d = (d + s) | 0)),
                  (i +=
                    (a =
                      ((a = (a + ((l / 67108864) | 0)) | 0) + (d >>> 26)) |
                      0) >>> 26),
                  (a &= 67108863);
              }
              (r.words[o] = s), (n = a), (a = i);
            }
            return 0 !== n ? (r.words[o] = n) : r.length--, r._strip();
          }
          function g(e, t, r) {
            return b(e, t, r);
          }
          function v(e, t) {
            (this.x = e), (this.y = t);
          }
          Math.imul || (m = p),
            (o.prototype.mulTo = function (e, t) {
              var r = this.length + e.length;
              return 10 === this.length && 10 === e.length
                ? m(this, e, t)
                : r < 63
                ? p(this, e, t)
                : r < 1024
                ? b(this, e, t)
                : g(this, e, t);
            }),
            (v.prototype.makeRBT = function (e) {
              for (
                var t = new Array(e), r = o.prototype._countBits(e) - 1, n = 0;
                n < e;
                n++
              )
                t[n] = this.revBin(n, r, e);
              return t;
            }),
            (v.prototype.revBin = function (e, t, r) {
              if (0 === e || e === r - 1) return e;
              for (var n = 0, i = 0; i < t; i++)
                (n |= (1 & e) << (t - i - 1)), (e >>= 1);
              return n;
            }),
            (v.prototype.permute = function (e, t, r, n, i, o) {
              for (var a = 0; a < o; a++) (n[a] = t[e[a]]), (i[a] = r[e[a]]);
            }),
            (v.prototype.transform = function (e, t, r, n, i, o) {
              this.permute(o, e, t, r, n, i);
              for (var a = 1; a < i; a <<= 1)
                for (
                  var s = a << 1,
                    u = Math.cos((2 * Math.PI) / s),
                    c = Math.sin((2 * Math.PI) / s),
                    f = 0;
                  f < i;
                  f += s
                )
                  for (var l = u, d = c, h = 0; h < a; h++) {
                    var p = r[f + h],
                      m = n[f + h],
                      b = r[f + h + a],
                      g = n[f + h + a],
                      v = l * b - d * g;
                    (g = l * g + d * b),
                      (b = v),
                      (r[f + h] = p + b),
                      (n[f + h] = m + g),
                      (r[f + h + a] = p - b),
                      (n[f + h + a] = m - g),
                      h !== s &&
                        ((v = u * l - c * d), (d = u * d + c * l), (l = v));
                  }
            }),
            (v.prototype.guessLen13b = function (e, t) {
              var r = 1 | Math.max(t, e),
                n = 1 & r,
                i = 0;
              for (r = (r / 2) | 0; r; r >>>= 1) i++;
              return 1 << (i + 1 + n);
            }),
            (v.prototype.conjugate = function (e, t, r) {
              if (!(r <= 1))
                for (var n = 0; n < r / 2; n++) {
                  var i = e[n];
                  (e[n] = e[r - n - 1]),
                    (e[r - n - 1] = i),
                    (i = t[n]),
                    (t[n] = -t[r - n - 1]),
                    (t[r - n - 1] = -i);
                }
            }),
            (v.prototype.normalize13b = function (e, t) {
              for (var r = 0, n = 0; n < t / 2; n++) {
                var i =
                  8192 * Math.round(e[2 * n + 1] / t) +
                  Math.round(e[2 * n] / t) +
                  r;
                (e[n] = 67108863 & i),
                  (r = i < 67108864 ? 0 : (i / 67108864) | 0);
              }
              return e;
            }),
            (v.prototype.convert13b = function (e, t, r, i) {
              for (var o = 0, a = 0; a < t; a++)
                (o += 0 | e[a]),
                  (r[2 * a] = 8191 & o),
                  (o >>>= 13),
                  (r[2 * a + 1] = 8191 & o),
                  (o >>>= 13);
              for (a = 2 * t; a < i; ++a) r[a] = 0;
              n(0 === o), n(0 == (-8192 & o));
            }),
            (v.prototype.stub = function (e) {
              for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
              return t;
            }),
            (v.prototype.mulp = function (e, t, r) {
              var n = 2 * this.guessLen13b(e.length, t.length),
                i = this.makeRBT(n),
                o = this.stub(n),
                a = new Array(n),
                s = new Array(n),
                u = new Array(n),
                c = new Array(n),
                f = new Array(n),
                l = new Array(n),
                d = r.words;
              (d.length = n),
                this.convert13b(e.words, e.length, a, n),
                this.convert13b(t.words, t.length, c, n),
                this.transform(a, o, s, u, n, i),
                this.transform(c, o, f, l, n, i);
              for (var h = 0; h < n; h++) {
                var p = s[h] * f[h] - u[h] * l[h];
                (u[h] = s[h] * l[h] + u[h] * f[h]), (s[h] = p);
              }
              return (
                this.conjugate(s, u, n),
                this.transform(s, u, d, o, n, i),
                this.conjugate(d, o, n),
                this.normalize13b(d, n),
                (r.negative = e.negative ^ t.negative),
                (r.length = e.length + t.length),
                r._strip()
              );
            }),
            (o.prototype.mul = function (e) {
              var t = new o(null);
              return (
                (t.words = new Array(this.length + e.length)), this.mulTo(e, t)
              );
            }),
            (o.prototype.mulf = function (e) {
              var t = new o(null);
              return (
                (t.words = new Array(this.length + e.length)), g(this, e, t)
              );
            }),
            (o.prototype.imul = function (e) {
              return this.clone().mulTo(e, this);
            }),
            (o.prototype.imuln = function (e) {
              var t = e < 0;
              t && (e = -e), n('number' == typeof e), n(e < 67108864);
              for (var r = 0, i = 0; i < this.length; i++) {
                var o = (0 | this.words[i]) * e,
                  a = (67108863 & o) + (67108863 & r);
                (r >>= 26),
                  (r += (o / 67108864) | 0),
                  (r += a >>> 26),
                  (this.words[i] = 67108863 & a);
              }
              return (
                0 !== r && ((this.words[i] = r), this.length++),
                t ? this.ineg() : this
              );
            }),
            (o.prototype.muln = function (e) {
              return this.clone().imuln(e);
            }),
            (o.prototype.sqr = function () {
              return this.mul(this);
            }),
            (o.prototype.isqr = function () {
              return this.imul(this.clone());
            }),
            (o.prototype.pow = function (e) {
              var t = (function (e) {
                for (
                  var t = new Array(e.bitLength()), r = 0;
                  r < t.length;
                  r++
                ) {
                  var n = (r / 26) | 0,
                    i = r % 26;
                  t[r] = (e.words[n] >>> i) & 1;
                }
                return t;
              })(e);
              if (0 === t.length) return new o(1);
              for (
                var r = this, n = 0;
                n < t.length && 0 === t[n];
                n++, r = r.sqr()
              );
              if (++n < t.length)
                for (var i = r.sqr(); n < t.length; n++, i = i.sqr())
                  0 !== t[n] && (r = r.mul(i));
              return r;
            }),
            (o.prototype.iushln = function (e) {
              n('number' == typeof e && e >= 0);
              var t,
                r = e % 26,
                i = (e - r) / 26,
                o = (67108863 >>> (26 - r)) << (26 - r);
              if (0 !== r) {
                var a = 0;
                for (t = 0; t < this.length; t++) {
                  var s = this.words[t] & o,
                    u = ((0 | this.words[t]) - s) << r;
                  (this.words[t] = u | a), (a = s >>> (26 - r));
                }
                a && ((this.words[t] = a), this.length++);
              }
              if (0 !== i) {
                for (t = this.length - 1; t >= 0; t--)
                  this.words[t + i] = this.words[t];
                for (t = 0; t < i; t++) this.words[t] = 0;
                this.length += i;
              }
              return this._strip();
            }),
            (o.prototype.ishln = function (e) {
              return n(0 === this.negative), this.iushln(e);
            }),
            (o.prototype.iushrn = function (e, t, r) {
              var i;
              n('number' == typeof e && e >= 0),
                (i = t ? (t - (t % 26)) / 26 : 0);
              var o = e % 26,
                a = Math.min((e - o) / 26, this.length),
                s = 67108863 ^ ((67108863 >>> o) << o),
                u = r;
              if (((i -= a), (i = Math.max(0, i)), u)) {
                for (var c = 0; c < a; c++) u.words[c] = this.words[c];
                u.length = a;
              }
              if (0 === a);
              else if (this.length > a)
                for (this.length -= a, c = 0; c < this.length; c++)
                  this.words[c] = this.words[c + a];
              else (this.words[0] = 0), (this.length = 1);
              var f = 0;
              for (c = this.length - 1; c >= 0 && (0 !== f || c >= i); c--) {
                var l = 0 | this.words[c];
                (this.words[c] = (f << (26 - o)) | (l >>> o)), (f = l & s);
              }
              return (
                u && 0 !== f && (u.words[u.length++] = f),
                0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                this._strip()
              );
            }),
            (o.prototype.ishrn = function (e, t, r) {
              return n(0 === this.negative), this.iushrn(e, t, r);
            }),
            (o.prototype.shln = function (e) {
              return this.clone().ishln(e);
            }),
            (o.prototype.ushln = function (e) {
              return this.clone().iushln(e);
            }),
            (o.prototype.shrn = function (e) {
              return this.clone().ishrn(e);
            }),
            (o.prototype.ushrn = function (e) {
              return this.clone().iushrn(e);
            }),
            (o.prototype.testn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t;
              return !(this.length <= r) && !!(this.words[r] & i);
            }),
            (o.prototype.imaskn = function (e) {
              n('number' == typeof e && e >= 0);
              var t = e % 26,
                r = (e - t) / 26;
              if (
                (n(
                  0 === this.negative,
                  'imaskn works only with positive numbers'
                ),
                this.length <= r)
              )
                return this;
              if (
                (0 !== t && r++,
                (this.length = Math.min(r, this.length)),
                0 !== t)
              ) {
                var i = 67108863 ^ ((67108863 >>> t) << t);
                this.words[this.length - 1] &= i;
              }
              return this._strip();
            }),
            (o.prototype.maskn = function (e) {
              return this.clone().imaskn(e);
            }),
            (o.prototype.iaddn = function (e) {
              return (
                n('number' == typeof e),
                n(e < 67108864),
                e < 0
                  ? this.isubn(-e)
                  : 0 !== this.negative
                  ? 1 === this.length && (0 | this.words[0]) <= e
                    ? ((this.words[0] = e - (0 | this.words[0])),
                      (this.negative = 0),
                      this)
                    : ((this.negative = 0),
                      this.isubn(e),
                      (this.negative = 1),
                      this)
                  : this._iaddn(e)
              );
            }),
            (o.prototype._iaddn = function (e) {
              this.words[0] += e;
              for (var t = 0; t < this.length && this.words[t] >= 67108864; t++)
                (this.words[t] -= 67108864),
                  t === this.length - 1
                    ? (this.words[t + 1] = 1)
                    : this.words[t + 1]++;
              return (this.length = Math.max(this.length, t + 1)), this;
            }),
            (o.prototype.isubn = function (e) {
              if ((n('number' == typeof e), n(e < 67108864), e < 0))
                return this.iaddn(-e);
              if (0 !== this.negative)
                return (
                  (this.negative = 0), this.iaddn(e), (this.negative = 1), this
                );
              if (
                ((this.words[0] -= e), 1 === this.length && this.words[0] < 0)
              )
                (this.words[0] = -this.words[0]), (this.negative = 1);
              else
                for (var t = 0; t < this.length && this.words[t] < 0; t++)
                  (this.words[t] += 67108864), (this.words[t + 1] -= 1);
              return this._strip();
            }),
            (o.prototype.addn = function (e) {
              return this.clone().iaddn(e);
            }),
            (o.prototype.subn = function (e) {
              return this.clone().isubn(e);
            }),
            (o.prototype.iabs = function () {
              return (this.negative = 0), this;
            }),
            (o.prototype.abs = function () {
              return this.clone().iabs();
            }),
            (o.prototype._ishlnsubmul = function (e, t, r) {
              var i,
                o,
                a = e.length + r;
              this._expand(a);
              var s = 0;
              for (i = 0; i < e.length; i++) {
                o = (0 | this.words[i + r]) + s;
                var u = (0 | e.words[i]) * t;
                (s = ((o -= 67108863 & u) >> 26) - ((u / 67108864) | 0)),
                  (this.words[i + r] = 67108863 & o);
              }
              for (; i < this.length - r; i++)
                (s = (o = (0 | this.words[i + r]) + s) >> 26),
                  (this.words[i + r] = 67108863 & o);
              if (0 === s) return this._strip();
              for (n(-1 === s), s = 0, i = 0; i < this.length; i++)
                (s = (o = -(0 | this.words[i]) + s) >> 26),
                  (this.words[i] = 67108863 & o);
              return (this.negative = 1), this._strip();
            }),
            (o.prototype._wordDiv = function (e, t) {
              var r = (this.length, e.length),
                n = this.clone(),
                i = e,
                a = 0 | i.words[i.length - 1];
              0 !== (r = 26 - this._countBits(a)) &&
                ((i = i.ushln(r)),
                n.iushln(r),
                (a = 0 | i.words[i.length - 1]));
              var s,
                u = n.length - i.length;
              if ('mod' !== t) {
                ((s = new o(null)).length = u + 1),
                  (s.words = new Array(s.length));
                for (var c = 0; c < s.length; c++) s.words[c] = 0;
              }
              var f = n.clone()._ishlnsubmul(i, 1, u);
              0 === f.negative && ((n = f), s && (s.words[u] = 1));
              for (var l = u - 1; l >= 0; l--) {
                var d =
                  67108864 * (0 | n.words[i.length + l]) +
                  (0 | n.words[i.length + l - 1]);
                for (
                  d = Math.min((d / a) | 0, 67108863), n._ishlnsubmul(i, d, l);
                  0 !== n.negative;

                )
                  d--,
                    (n.negative = 0),
                    n._ishlnsubmul(i, 1, l),
                    n.isZero() || (n.negative ^= 1);
                s && (s.words[l] = d);
              }
              return (
                s && s._strip(),
                n._strip(),
                'div' !== t && 0 !== r && n.iushrn(r),
                { div: s || null, mod: n }
              );
            }),
            (o.prototype.divmod = function (e, t, r) {
              return (
                n(!e.isZero()),
                this.isZero()
                  ? { div: new o(0), mod: new o(0) }
                  : 0 !== this.negative && 0 === e.negative
                  ? ((s = this.neg().divmod(e, t)),
                    'mod' !== t && (i = s.div.neg()),
                    'div' !== t &&
                      ((a = s.mod.neg()), r && 0 !== a.negative && a.iadd(e)),
                    { div: i, mod: a })
                  : 0 === this.negative && 0 !== e.negative
                  ? ((s = this.divmod(e.neg(), t)),
                    'mod' !== t && (i = s.div.neg()),
                    { div: i, mod: s.mod })
                  : 0 != (this.negative & e.negative)
                  ? ((s = this.neg().divmod(e.neg(), t)),
                    'div' !== t &&
                      ((a = s.mod.neg()), r && 0 !== a.negative && a.isub(e)),
                    { div: s.div, mod: a })
                  : e.length > this.length || this.cmp(e) < 0
                  ? { div: new o(0), mod: this }
                  : 1 === e.length
                  ? 'div' === t
                    ? { div: this.divn(e.words[0]), mod: null }
                    : 'mod' === t
                    ? { div: null, mod: new o(this.modrn(e.words[0])) }
                    : {
                        div: this.divn(e.words[0]),
                        mod: new o(this.modrn(e.words[0])),
                      }
                  : this._wordDiv(e, t)
              );
              var i, a, s;
            }),
            (o.prototype.div = function (e) {
              return this.divmod(e, 'div', !1).div;
            }),
            (o.prototype.mod = function (e) {
              return this.divmod(e, 'mod', !1).mod;
            }),
            (o.prototype.umod = function (e) {
              return this.divmod(e, 'mod', !0).mod;
            }),
            (o.prototype.divRound = function (e) {
              var t = this.divmod(e);
              if (t.mod.isZero()) return t.div;
              var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod,
                n = e.ushrn(1),
                i = e.andln(1),
                o = r.cmp(n);
              return o < 0 || (1 === i && 0 === o)
                ? t.div
                : 0 !== t.div.negative
                ? t.div.isubn(1)
                : t.div.iaddn(1);
            }),
            (o.prototype.modrn = function (e) {
              var t = e < 0;
              t && (e = -e), n(e <= 67108863);
              for (
                var r = (1 << 26) % e, i = 0, o = this.length - 1;
                o >= 0;
                o--
              )
                i = (r * i + (0 | this.words[o])) % e;
              return t ? -i : i;
            }),
            (o.prototype.modn = function (e) {
              return this.modrn(e);
            }),
            (o.prototype.idivn = function (e) {
              var t = e < 0;
              t && (e = -e), n(e <= 67108863);
              for (var r = 0, i = this.length - 1; i >= 0; i--) {
                var o = (0 | this.words[i]) + 67108864 * r;
                (this.words[i] = (o / e) | 0), (r = o % e);
              }
              return this._strip(), t ? this.ineg() : this;
            }),
            (o.prototype.divn = function (e) {
              return this.clone().idivn(e);
            }),
            (o.prototype.egcd = function (e) {
              n(0 === e.negative), n(!e.isZero());
              var t = this,
                r = e.clone();
              t = 0 !== t.negative ? t.umod(e) : t.clone();
              for (
                var i = new o(1),
                  a = new o(0),
                  s = new o(0),
                  u = new o(1),
                  c = 0;
                t.isEven() && r.isEven();

              )
                t.iushrn(1), r.iushrn(1), ++c;
              for (var f = r.clone(), l = t.clone(); !t.isZero(); ) {
                for (
                  var d = 0, h = 1;
                  0 == (t.words[0] & h) && d < 26;
                  ++d, h <<= 1
                );
                if (d > 0)
                  for (t.iushrn(d); d-- > 0; )
                    (i.isOdd() || a.isOdd()) && (i.iadd(f), a.isub(l)),
                      i.iushrn(1),
                      a.iushrn(1);
                for (
                  var p = 0, m = 1;
                  0 == (r.words[0] & m) && p < 26;
                  ++p, m <<= 1
                );
                if (p > 0)
                  for (r.iushrn(p); p-- > 0; )
                    (s.isOdd() || u.isOdd()) && (s.iadd(f), u.isub(l)),
                      s.iushrn(1),
                      u.iushrn(1);
                t.cmp(r) >= 0
                  ? (t.isub(r), i.isub(s), a.isub(u))
                  : (r.isub(t), s.isub(i), u.isub(a));
              }
              return { a: s, b: u, gcd: r.iushln(c) };
            }),
            (o.prototype._invmp = function (e) {
              n(0 === e.negative), n(!e.isZero());
              var t = this,
                r = e.clone();
              t = 0 !== t.negative ? t.umod(e) : t.clone();
              for (
                var i, a = new o(1), s = new o(0), u = r.clone();
                t.cmpn(1) > 0 && r.cmpn(1) > 0;

              ) {
                for (
                  var c = 0, f = 1;
                  0 == (t.words[0] & f) && c < 26;
                  ++c, f <<= 1
                );
                if (c > 0)
                  for (t.iushrn(c); c-- > 0; )
                    a.isOdd() && a.iadd(u), a.iushrn(1);
                for (
                  var l = 0, d = 1;
                  0 == (r.words[0] & d) && l < 26;
                  ++l, d <<= 1
                );
                if (l > 0)
                  for (r.iushrn(l); l-- > 0; )
                    s.isOdd() && s.iadd(u), s.iushrn(1);
                t.cmp(r) >= 0 ? (t.isub(r), a.isub(s)) : (r.isub(t), s.isub(a));
              }
              return (i = 0 === t.cmpn(1) ? a : s).cmpn(0) < 0 && i.iadd(e), i;
            }),
            (o.prototype.gcd = function (e) {
              if (this.isZero()) return e.abs();
              if (e.isZero()) return this.abs();
              var t = this.clone(),
                r = e.clone();
              (t.negative = 0), (r.negative = 0);
              for (var n = 0; t.isEven() && r.isEven(); n++)
                t.iushrn(1), r.iushrn(1);
              for (;;) {
                for (; t.isEven(); ) t.iushrn(1);
                for (; r.isEven(); ) r.iushrn(1);
                var i = t.cmp(r);
                if (i < 0) {
                  var o = t;
                  (t = r), (r = o);
                } else if (0 === i || 0 === r.cmpn(1)) break;
                t.isub(r);
              }
              return r.iushln(n);
            }),
            (o.prototype.invm = function (e) {
              return this.egcd(e).a.umod(e);
            }),
            (o.prototype.isEven = function () {
              return 0 == (1 & this.words[0]);
            }),
            (o.prototype.isOdd = function () {
              return 1 == (1 & this.words[0]);
            }),
            (o.prototype.andln = function (e) {
              return this.words[0] & e;
            }),
            (o.prototype.bincn = function (e) {
              n('number' == typeof e);
              var t = e % 26,
                r = (e - t) / 26,
                i = 1 << t;
              if (this.length <= r)
                return this._expand(r + 1), (this.words[r] |= i), this;
              for (var o = i, a = r; 0 !== o && a < this.length; a++) {
                var s = 0 | this.words[a];
                (o = (s += o) >>> 26), (s &= 67108863), (this.words[a] = s);
              }
              return 0 !== o && ((this.words[a] = o), this.length++), this;
            }),
            (o.prototype.isZero = function () {
              return 1 === this.length && 0 === this.words[0];
            }),
            (o.prototype.cmpn = function (e) {
              var t,
                r = e < 0;
              if (0 !== this.negative && !r) return -1;
              if (0 === this.negative && r) return 1;
              if ((this._strip(), this.length > 1)) t = 1;
              else {
                r && (e = -e), n(e <= 67108863, 'Number is too big');
                var i = 0 | this.words[0];
                t = i === e ? 0 : i < e ? -1 : 1;
              }
              return 0 !== this.negative ? 0 | -t : t;
            }),
            (o.prototype.cmp = function (e) {
              if (0 !== this.negative && 0 === e.negative) return -1;
              if (0 === this.negative && 0 !== e.negative) return 1;
              var t = this.ucmp(e);
              return 0 !== this.negative ? 0 | -t : t;
            }),
            (o.prototype.ucmp = function (e) {
              if (this.length > e.length) return 1;
              if (this.length < e.length) return -1;
              for (var t = 0, r = this.length - 1; r >= 0; r--) {
                var n = 0 | this.words[r],
                  i = 0 | e.words[r];
                if (n !== i) {
                  n < i ? (t = -1) : n > i && (t = 1);
                  break;
                }
              }
              return t;
            }),
            (o.prototype.gtn = function (e) {
              return 1 === this.cmpn(e);
            }),
            (o.prototype.gt = function (e) {
              return 1 === this.cmp(e);
            }),
            (o.prototype.gten = function (e) {
              return this.cmpn(e) >= 0;
            }),
            (o.prototype.gte = function (e) {
              return this.cmp(e) >= 0;
            }),
            (o.prototype.ltn = function (e) {
              return -1 === this.cmpn(e);
            }),
            (o.prototype.lt = function (e) {
              return -1 === this.cmp(e);
            }),
            (o.prototype.lten = function (e) {
              return this.cmpn(e) <= 0;
            }),
            (o.prototype.lte = function (e) {
              return this.cmp(e) <= 0;
            }),
            (o.prototype.eqn = function (e) {
              return 0 === this.cmpn(e);
            }),
            (o.prototype.eq = function (e) {
              return 0 === this.cmp(e);
            }),
            (o.red = function (e) {
              return new k(e);
            }),
            (o.prototype.toRed = function (e) {
              return (
                n(!this.red, 'Already a number in reduction context'),
                n(0 === this.negative, 'red works only with positives'),
                e.convertTo(this)._forceRed(e)
              );
            }),
            (o.prototype.fromRed = function () {
              return (
                n(
                  this.red,
                  'fromRed works only with numbers in reduction context'
                ),
                this.red.convertFrom(this)
              );
            }),
            (o.prototype._forceRed = function (e) {
              return (this.red = e), this;
            }),
            (o.prototype.forceRed = function (e) {
              return (
                n(!this.red, 'Already a number in reduction context'),
                this._forceRed(e)
              );
            }),
            (o.prototype.redAdd = function (e) {
              return (
                n(this.red, 'redAdd works only with red numbers'),
                this.red.add(this, e)
              );
            }),
            (o.prototype.redIAdd = function (e) {
              return (
                n(this.red, 'redIAdd works only with red numbers'),
                this.red.iadd(this, e)
              );
            }),
            (o.prototype.redSub = function (e) {
              return (
                n(this.red, 'redSub works only with red numbers'),
                this.red.sub(this, e)
              );
            }),
            (o.prototype.redISub = function (e) {
              return (
                n(this.red, 'redISub works only with red numbers'),
                this.red.isub(this, e)
              );
            }),
            (o.prototype.redShl = function (e) {
              return (
                n(this.red, 'redShl works only with red numbers'),
                this.red.shl(this, e)
              );
            }),
            (o.prototype.redMul = function (e) {
              return (
                n(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, e),
                this.red.mul(this, e)
              );
            }),
            (o.prototype.redIMul = function (e) {
              return (
                n(this.red, 'redMul works only with red numbers'),
                this.red._verify2(this, e),
                this.red.imul(this, e)
              );
            }),
            (o.prototype.redSqr = function () {
              return (
                n(this.red, 'redSqr works only with red numbers'),
                this.red._verify1(this),
                this.red.sqr(this)
              );
            }),
            (o.prototype.redISqr = function () {
              return (
                n(this.red, 'redISqr works only with red numbers'),
                this.red._verify1(this),
                this.red.isqr(this)
              );
            }),
            (o.prototype.redSqrt = function () {
              return (
                n(this.red, 'redSqrt works only with red numbers'),
                this.red._verify1(this),
                this.red.sqrt(this)
              );
            }),
            (o.prototype.redInvm = function () {
              return (
                n(this.red, 'redInvm works only with red numbers'),
                this.red._verify1(this),
                this.red.invm(this)
              );
            }),
            (o.prototype.redNeg = function () {
              return (
                n(this.red, 'redNeg works only with red numbers'),
                this.red._verify1(this),
                this.red.neg(this)
              );
            }),
            (o.prototype.redPow = function (e) {
              return (
                n(this.red && !e.red, 'redPow(normalNum)'),
                this.red._verify1(this),
                this.red.pow(this, e)
              );
            });
          var y = { k256: null, p224: null, p192: null, p25519: null };
          function w(e, t) {
            (this.name = e),
              (this.p = new o(t, 16)),
              (this.n = this.p.bitLength()),
              (this.k = new o(1).iushln(this.n).isub(this.p)),
              (this.tmp = this._tmp());
          }
          function _() {
            w.call(
              this,
              'k256',
              'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
            );
          }
          function S() {
            w.call(
              this,
              'p224',
              'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001'
            );
          }
          function M() {
            w.call(
              this,
              'p192',
              'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff'
            );
          }
          function E() {
            w.call(
              this,
              '25519',
              '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed'
            );
          }
          function k(e) {
            if ('string' == typeof e) {
              var t = o._prime(e);
              (this.m = t.p), (this.prime = t);
            } else
              n(e.gtn(1), 'modulus must be greater than 1'),
                (this.m = e),
                (this.prime = null);
          }
          function x(e) {
            k.call(this, e),
              (this.shift = this.m.bitLength()),
              this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
              (this.r = new o(1).iushln(this.shift)),
              (this.r2 = this.imod(this.r.sqr())),
              (this.rinv = this.r._invmp(this.m)),
              (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
              (this.minv = this.minv.umod(this.r)),
              (this.minv = this.r.sub(this.minv));
          }
          (w.prototype._tmp = function () {
            var e = new o(null);
            return (e.words = new Array(Math.ceil(this.n / 13))), e;
          }),
            (w.prototype.ireduce = function (e) {
              var t,
                r = e;
              do {
                this.split(r, this.tmp),
                  (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength());
              } while (t > this.n);
              var n = t < this.n ? -1 : r.ucmp(this.p);
              return (
                0 === n
                  ? ((r.words[0] = 0), (r.length = 1))
                  : n > 0
                  ? r.isub(this.p)
                  : void 0 !== r.strip
                  ? r.strip()
                  : r._strip(),
                r
              );
            }),
            (w.prototype.split = function (e, t) {
              e.iushrn(this.n, 0, t);
            }),
            (w.prototype.imulK = function (e) {
              return e.imul(this.k);
            }),
            i(_, w),
            (_.prototype.split = function (e, t) {
              for (var r = Math.min(e.length, 9), n = 0; n < r; n++)
                t.words[n] = e.words[n];
              if (((t.length = r), e.length <= 9))
                return (e.words[0] = 0), void (e.length = 1);
              var i = e.words[9];
              for (
                t.words[t.length++] = 4194303 & i, n = 10;
                n < e.length;
                n++
              ) {
                var o = 0 | e.words[n];
                (e.words[n - 10] = ((4194303 & o) << 4) | (i >>> 22)), (i = o);
              }
              (i >>>= 22),
                (e.words[n - 10] = i),
                0 === i && e.length > 10 ? (e.length -= 10) : (e.length -= 9);
            }),
            (_.prototype.imulK = function (e) {
              (e.words[e.length] = 0),
                (e.words[e.length + 1] = 0),
                (e.length += 2);
              for (var t = 0, r = 0; r < e.length; r++) {
                var n = 0 | e.words[r];
                (t += 977 * n),
                  (e.words[r] = 67108863 & t),
                  (t = 64 * n + ((t / 67108864) | 0));
              }
              return (
                0 === e.words[e.length - 1] &&
                  (e.length--, 0 === e.words[e.length - 1] && e.length--),
                e
              );
            }),
            i(S, w),
            i(M, w),
            i(E, w),
            (E.prototype.imulK = function (e) {
              for (var t = 0, r = 0; r < e.length; r++) {
                var n = 19 * (0 | e.words[r]) + t,
                  i = 67108863 & n;
                (n >>>= 26), (e.words[r] = i), (t = n);
              }
              return 0 !== t && (e.words[e.length++] = t), e;
            }),
            (o._prime = function (e) {
              if (y[e]) return y[e];
              var t;
              if ('k256' === e) t = new _();
              else if ('p224' === e) t = new S();
              else if ('p192' === e) t = new M();
              else {
                if ('p25519' !== e) throw new Error('Unknown prime ' + e);
                t = new E();
              }
              return (y[e] = t), t;
            }),
            (k.prototype._verify1 = function (e) {
              n(0 === e.negative, 'red works only with positives'),
                n(e.red, 'red works only with red numbers');
            }),
            (k.prototype._verify2 = function (e, t) {
              n(
                0 == (e.negative | t.negative),
                'red works only with positives'
              ),
                n(e.red && e.red === t.red, 'red works only with red numbers');
            }),
            (k.prototype.imod = function (e) {
              return this.prime
                ? this.prime.ireduce(e)._forceRed(this)
                : (c(e, e.umod(this.m)._forceRed(this)), e);
            }),
            (k.prototype.neg = function (e) {
              return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
            }),
            (k.prototype.add = function (e, t) {
              this._verify2(e, t);
              var r = e.add(t);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
            }),
            (k.prototype.iadd = function (e, t) {
              this._verify2(e, t);
              var r = e.iadd(t);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r;
            }),
            (k.prototype.sub = function (e, t) {
              this._verify2(e, t);
              var r = e.sub(t);
              return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
            }),
            (k.prototype.isub = function (e, t) {
              this._verify2(e, t);
              var r = e.isub(t);
              return r.cmpn(0) < 0 && r.iadd(this.m), r;
            }),
            (k.prototype.shl = function (e, t) {
              return this._verify1(e), this.imod(e.ushln(t));
            }),
            (k.prototype.imul = function (e, t) {
              return this._verify2(e, t), this.imod(e.imul(t));
            }),
            (k.prototype.mul = function (e, t) {
              return this._verify2(e, t), this.imod(e.mul(t));
            }),
            (k.prototype.isqr = function (e) {
              return this.imul(e, e.clone());
            }),
            (k.prototype.sqr = function (e) {
              return this.mul(e, e);
            }),
            (k.prototype.sqrt = function (e) {
              if (e.isZero()) return e.clone();
              var t = this.m.andln(3);
              if ((n(t % 2 == 1), 3 === t)) {
                var r = this.m.add(new o(1)).iushrn(2);
                return this.pow(e, r);
              }
              for (
                var i = this.m.subn(1), a = 0;
                !i.isZero() && 0 === i.andln(1);

              )
                a++, i.iushrn(1);
              n(!i.isZero());
              var s = new o(1).toRed(this),
                u = s.redNeg(),
                c = this.m.subn(1).iushrn(1),
                f = this.m.bitLength();
              for (
                f = new o(2 * f * f).toRed(this);
                0 !== this.pow(f, c).cmp(u);

              )
                f.redIAdd(u);
              for (
                var l = this.pow(f, i),
                  d = this.pow(e, i.addn(1).iushrn(1)),
                  h = this.pow(e, i),
                  p = a;
                0 !== h.cmp(s);

              ) {
                for (var m = h, b = 0; 0 !== m.cmp(s); b++) m = m.redSqr();
                n(b < p);
                var g = this.pow(l, new o(1).iushln(p - b - 1));
                (d = d.redMul(g)), (l = g.redSqr()), (h = h.redMul(l)), (p = b);
              }
              return d;
            }),
            (k.prototype.invm = function (e) {
              var t = e._invmp(this.m);
              return 0 !== t.negative
                ? ((t.negative = 0), this.imod(t).redNeg())
                : this.imod(t);
            }),
            (k.prototype.pow = function (e, t) {
              if (t.isZero()) return new o(1).toRed(this);
              if (0 === t.cmpn(1)) return e.clone();
              var r = new Array(16);
              (r[0] = new o(1).toRed(this)), (r[1] = e);
              for (var n = 2; n < r.length; n++) r[n] = this.mul(r[n - 1], e);
              var i = r[0],
                a = 0,
                s = 0,
                u = t.bitLength() % 26;
              for (0 === u && (u = 26), n = t.length - 1; n >= 0; n--) {
                for (var c = t.words[n], f = u - 1; f >= 0; f--) {
                  var l = (c >> f) & 1;
                  i !== r[0] && (i = this.sqr(i)),
                    0 !== l || 0 !== a
                      ? ((a <<= 1),
                        (a |= l),
                        (4 === ++s || (0 === n && 0 === f)) &&
                          ((i = this.mul(i, r[a])), (s = 0), (a = 0)))
                      : (s = 0);
                }
                u = 26;
              }
              return i;
            }),
            (k.prototype.convertTo = function (e) {
              var t = e.umod(this.m);
              return t === e ? t.clone() : t;
            }),
            (k.prototype.convertFrom = function (e) {
              var t = e.clone();
              return (t.red = null), t;
            }),
            (o.mont = function (e) {
              return new x(e);
            }),
            i(x, k),
            (x.prototype.convertTo = function (e) {
              return this.imod(e.ushln(this.shift));
            }),
            (x.prototype.convertFrom = function (e) {
              var t = this.imod(e.mul(this.rinv));
              return (t.red = null), t;
            }),
            (x.prototype.imul = function (e, t) {
              if (e.isZero() || t.isZero())
                return (e.words[0] = 0), (e.length = 1), e;
              var r = e.imul(t),
                n = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                i = r.isub(n).iushrn(this.shift),
                o = i;
              return (
                i.cmp(this.m) >= 0
                  ? (o = i.isub(this.m))
                  : i.cmpn(0) < 0 && (o = i.iadd(this.m)),
                o._forceRed(this)
              );
            }),
            (x.prototype.mul = function (e, t) {
              if (e.isZero() || t.isZero()) return new o(0)._forceRed(this);
              var r = e.mul(t),
                n = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                i = r.isub(n).iushrn(this.shift),
                a = i;
              return (
                i.cmp(this.m) >= 0
                  ? (a = i.isub(this.m))
                  : i.cmpn(0) < 0 && (a = i.iadd(this.m)),
                a._forceRed(this)
              );
            }),
            (x.prototype.invm = function (e) {
              return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
            });
        })(e, this);
      }.call(this, r(42)(e)));
    },
    function (e) {
      e.exports = JSON.parse(
        '{"name":"elliptic","version":"6.5.2","description":"EC cryptography","main":"lib/elliptic.js","files":["lib"],"scripts":{"jscs":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","jshint":"jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js","lint":"npm run jscs && npm run jshint","unit":"istanbul test _mocha --reporter=spec test/index.js","test":"npm run lint && npm run unit","version":"grunt dist && git add dist/"},"repository":{"type":"git","url":"git@github.com:indutny/elliptic"},"keywords":["EC","Elliptic","curve","Cryptography"],"author":"Fedor Indutny <fedor@indutny.com>","license":"MIT","bugs":{"url":"https://github.com/indutny/elliptic/issues"},"homepage":"https://github.com/indutny/elliptic","devDependencies":{"brfs":"^1.4.3","coveralls":"^3.0.8","grunt":"^1.0.4","grunt-browserify":"^5.0.0","grunt-cli":"^1.2.0","grunt-contrib-connect":"^1.0.0","grunt-contrib-copy":"^1.0.0","grunt-contrib-uglify":"^1.0.1","grunt-mocha-istanbul":"^3.0.1","grunt-saucelabs":"^9.0.1","istanbul":"^0.4.2","jscs":"^3.0.7","jshint":"^2.10.3","mocha":"^6.2.2"},"dependencies":{"bn.js":"^4.4.0","brorand":"^1.0.1","hash.js":"^1.0.0","hmac-drbg":"^1.0.0","inherits":"^2.0.1","minimalistic-assert":"^1.0.0","minimalistic-crypto-utils":"^1.0.0"}}'
      );
    },
    function (e, t, r) {
      'use strict';
      var n = r(7),
        i = r(14),
        o = r(25),
        a = r(44),
        s = n.assert;
      function u(e) {
        a.call(this, 'short', e),
          (this.a = new i(e.a, 16).toRed(this.red)),
          (this.b = new i(e.b, 16).toRed(this.red)),
          (this.tinv = this.two.redInvm()),
          (this.zeroA = 0 === this.a.fromRed().cmpn(0)),
          (this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3)),
          (this.endo = this._getEndomorphism(e)),
          (this._endoWnafT1 = new Array(4)),
          (this._endoWnafT2 = new Array(4));
      }
      function c(e, t, r, n) {
        a.BasePoint.call(this, e, 'affine'),
          null === t && null === r
            ? ((this.x = null), (this.y = null), (this.inf = !0))
            : ((this.x = new i(t, 16)),
              (this.y = new i(r, 16)),
              n &&
                (this.x.forceRed(this.curve.red),
                this.y.forceRed(this.curve.red)),
              this.x.red || (this.x = this.x.toRed(this.curve.red)),
              this.y.red || (this.y = this.y.toRed(this.curve.red)),
              (this.inf = !1));
      }
      function f(e, t, r, n) {
        a.BasePoint.call(this, e, 'jacobian'),
          null === t && null === r && null === n
            ? ((this.x = this.curve.one),
              (this.y = this.curve.one),
              (this.z = new i(0)))
            : ((this.x = new i(t, 16)),
              (this.y = new i(r, 16)),
              (this.z = new i(n, 16))),
          this.x.red || (this.x = this.x.toRed(this.curve.red)),
          this.y.red || (this.y = this.y.toRed(this.curve.red)),
          this.z.red || (this.z = this.z.toRed(this.curve.red)),
          (this.zOne = this.z === this.curve.one);
      }
      o(u, a),
        (e.exports = u),
        (u.prototype._getEndomorphism = function (e) {
          if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
            var t, r;
            if (e.beta) t = new i(e.beta, 16).toRed(this.red);
            else {
              var n = this._getEndoRoots(this.p);
              t = (t = n[0].cmp(n[1]) < 0 ? n[0] : n[1]).toRed(this.red);
            }
            if (e.lambda) r = new i(e.lambda, 16);
            else {
              var o = this._getEndoRoots(this.n);
              0 === this.g.mul(o[0]).x.cmp(this.g.x.redMul(t))
                ? (r = o[0])
                : ((r = o[1]),
                  s(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t))));
            }
            return {
              beta: t,
              lambda: r,
              basis: e.basis
                ? e.basis.map(function (e) {
                    return { a: new i(e.a, 16), b: new i(e.b, 16) };
                  })
                : this._getEndoBasis(r),
            };
          }
        }),
        (u.prototype._getEndoRoots = function (e) {
          var t = e === this.p ? this.red : i.mont(e),
            r = new i(2).toRed(t).redInvm(),
            n = r.redNeg(),
            o = new i(3).toRed(t).redNeg().redSqrt().redMul(r);
          return [n.redAdd(o).fromRed(), n.redSub(o).fromRed()];
        }),
        (u.prototype._getEndoBasis = function (e) {
          for (
            var t,
              r,
              n,
              o,
              a,
              s,
              u,
              c,
              f,
              l = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
              d = e,
              h = this.n.clone(),
              p = new i(1),
              m = new i(0),
              b = new i(0),
              g = new i(1),
              v = 0;
            0 !== d.cmpn(0);

          ) {
            var y = h.div(d);
            (c = h.sub(y.mul(d))), (f = b.sub(y.mul(p)));
            var w = g.sub(y.mul(m));
            if (!n && c.cmp(l) < 0)
              (t = u.neg()), (r = p), (n = c.neg()), (o = f);
            else if (n && 2 == ++v) break;
            (u = c), (h = d), (d = c), (b = p), (p = f), (g = m), (m = w);
          }
          (a = c.neg()), (s = f);
          var _ = n.sqr().add(o.sqr());
          return (
            a.sqr().add(s.sqr()).cmp(_) >= 0 && ((a = t), (s = r)),
            n.negative && ((n = n.neg()), (o = o.neg())),
            a.negative && ((a = a.neg()), (s = s.neg())),
            [
              { a: n, b: o },
              { a: a, b: s },
            ]
          );
        }),
        (u.prototype._endoSplit = function (e) {
          var t = this.endo.basis,
            r = t[0],
            n = t[1],
            i = n.b.mul(e).divRound(this.n),
            o = r.b.neg().mul(e).divRound(this.n),
            a = i.mul(r.a),
            s = o.mul(n.a),
            u = i.mul(r.b),
            c = o.mul(n.b);
          return { k1: e.sub(a).sub(s), k2: u.add(c).neg() };
        }),
        (u.prototype.pointFromX = function (e, t) {
          (e = new i(e, 16)).red || (e = e.toRed(this.red));
          var r = e
              .redSqr()
              .redMul(e)
              .redIAdd(e.redMul(this.a))
              .redIAdd(this.b),
            n = r.redSqrt();
          if (0 !== n.redSqr().redSub(r).cmp(this.zero))
            throw new Error('invalid point');
          var o = n.fromRed().isOdd();
          return ((t && !o) || (!t && o)) && (n = n.redNeg()), this.point(e, n);
        }),
        (u.prototype.validate = function (e) {
          if (e.inf) return !0;
          var t = e.x,
            r = e.y,
            n = this.a.redMul(t),
            i = t.redSqr().redMul(t).redIAdd(n).redIAdd(this.b);
          return 0 === r.redSqr().redISub(i).cmpn(0);
        }),
        (u.prototype._endoWnafMulAdd = function (e, t, r) {
          for (
            var n = this._endoWnafT1, i = this._endoWnafT2, o = 0;
            o < e.length;
            o++
          ) {
            var a = this._endoSplit(t[o]),
              s = e[o],
              u = s._getBeta();
            a.k1.negative && (a.k1.ineg(), (s = s.neg(!0))),
              a.k2.negative && (a.k2.ineg(), (u = u.neg(!0))),
              (n[2 * o] = s),
              (n[2 * o + 1] = u),
              (i[2 * o] = a.k1),
              (i[2 * o + 1] = a.k2);
          }
          for (
            var c = this._wnafMulAdd(1, n, i, 2 * o, r), f = 0;
            f < 2 * o;
            f++
          )
            (n[f] = null), (i[f] = null);
          return c;
        }),
        o(c, a.BasePoint),
        (u.prototype.point = function (e, t, r) {
          return new c(this, e, t, r);
        }),
        (u.prototype.pointFromJSON = function (e, t) {
          return c.fromJSON(this, e, t);
        }),
        (c.prototype._getBeta = function () {
          if (this.curve.endo) {
            var e = this.precomputed;
            if (e && e.beta) return e.beta;
            var t = this.curve.point(
              this.x.redMul(this.curve.endo.beta),
              this.y
            );
            if (e) {
              var r = this.curve,
                n = function (e) {
                  return r.point(e.x.redMul(r.endo.beta), e.y);
                };
              (e.beta = t),
                (t.precomputed = {
                  beta: null,
                  naf: e.naf && { wnd: e.naf.wnd, points: e.naf.points.map(n) },
                  doubles: e.doubles && {
                    step: e.doubles.step,
                    points: e.doubles.points.map(n),
                  },
                });
            }
            return t;
          }
        }),
        (c.prototype.toJSON = function () {
          return this.precomputed
            ? [
                this.x,
                this.y,
                this.precomputed && {
                  doubles: this.precomputed.doubles && {
                    step: this.precomputed.doubles.step,
                    points: this.precomputed.doubles.points.slice(1),
                  },
                  naf: this.precomputed.naf && {
                    wnd: this.precomputed.naf.wnd,
                    points: this.precomputed.naf.points.slice(1),
                  },
                },
              ]
            : [this.x, this.y];
        }),
        (c.fromJSON = function (e, t, r) {
          'string' == typeof t && (t = JSON.parse(t));
          var n = e.point(t[0], t[1], r);
          if (!t[2]) return n;
          function i(t) {
            return e.point(t[0], t[1], r);
          }
          var o = t[2];
          return (
            (n.precomputed = {
              beta: null,
              doubles: o.doubles && {
                step: o.doubles.step,
                points: [n].concat(o.doubles.points.map(i)),
              },
              naf: o.naf && {
                wnd: o.naf.wnd,
                points: [n].concat(o.naf.points.map(i)),
              },
            }),
            n
          );
        }),
        (c.prototype.inspect = function () {
          return this.isInfinity()
            ? '<EC Point Infinity>'
            : '<EC Point x: ' +
                this.x.fromRed().toString(16, 2) +
                ' y: ' +
                this.y.fromRed().toString(16, 2) +
                '>';
        }),
        (c.prototype.isInfinity = function () {
          return this.inf;
        }),
        (c.prototype.add = function (e) {
          if (this.inf) return e;
          if (e.inf) return this;
          if (this.eq(e)) return this.dbl();
          if (this.neg().eq(e)) return this.curve.point(null, null);
          if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
          var t = this.y.redSub(e.y);
          0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
          var r = t.redSqr().redISub(this.x).redISub(e.x),
            n = t.redMul(this.x.redSub(r)).redISub(this.y);
          return this.curve.point(r, n);
        }),
        (c.prototype.dbl = function () {
          if (this.inf) return this;
          var e = this.y.redAdd(this.y);
          if (0 === e.cmpn(0)) return this.curve.point(null, null);
          var t = this.curve.a,
            r = this.x.redSqr(),
            n = e.redInvm(),
            i = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(n),
            o = i.redSqr().redISub(this.x.redAdd(this.x)),
            a = i.redMul(this.x.redSub(o)).redISub(this.y);
          return this.curve.point(o, a);
        }),
        (c.prototype.getX = function () {
          return this.x.fromRed();
        }),
        (c.prototype.getY = function () {
          return this.y.fromRed();
        }),
        (c.prototype.mul = function (e) {
          return (
            (e = new i(e, 16)),
            this.isInfinity()
              ? this
              : this._hasDoubles(e)
              ? this.curve._fixedNafMul(this, e)
              : this.curve.endo
              ? this.curve._endoWnafMulAdd([this], [e])
              : this.curve._wnafMul(this, e)
          );
        }),
        (c.prototype.mulAdd = function (e, t, r) {
          var n = [this, t],
            i = [e, r];
          return this.curve.endo
            ? this.curve._endoWnafMulAdd(n, i)
            : this.curve._wnafMulAdd(1, n, i, 2);
        }),
        (c.prototype.jmulAdd = function (e, t, r) {
          var n = [this, t],
            i = [e, r];
          return this.curve.endo
            ? this.curve._endoWnafMulAdd(n, i, !0)
            : this.curve._wnafMulAdd(1, n, i, 2, !0);
        }),
        (c.prototype.eq = function (e) {
          return (
            this === e ||
            (this.inf === e.inf &&
              (this.inf || (0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))))
          );
        }),
        (c.prototype.neg = function (e) {
          if (this.inf) return this;
          var t = this.curve.point(this.x, this.y.redNeg());
          if (e && this.precomputed) {
            var r = this.precomputed,
              n = function (e) {
                return e.neg();
              };
            t.precomputed = {
              naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(n) },
              doubles: r.doubles && {
                step: r.doubles.step,
                points: r.doubles.points.map(n),
              },
            };
          }
          return t;
        }),
        (c.prototype.toJ = function () {
          return this.inf
            ? this.curve.jpoint(null, null, null)
            : this.curve.jpoint(this.x, this.y, this.curve.one);
        }),
        o(f, a.BasePoint),
        (u.prototype.jpoint = function (e, t, r) {
          return new f(this, e, t, r);
        }),
        (f.prototype.toP = function () {
          if (this.isInfinity()) return this.curve.point(null, null);
          var e = this.z.redInvm(),
            t = e.redSqr(),
            r = this.x.redMul(t),
            n = this.y.redMul(t).redMul(e);
          return this.curve.point(r, n);
        }),
        (f.prototype.neg = function () {
          return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
        }),
        (f.prototype.add = function (e) {
          if (this.isInfinity()) return e;
          if (e.isInfinity()) return this;
          var t = e.z.redSqr(),
            r = this.z.redSqr(),
            n = this.x.redMul(t),
            i = e.x.redMul(r),
            o = this.y.redMul(t.redMul(e.z)),
            a = e.y.redMul(r.redMul(this.z)),
            s = n.redSub(i),
            u = o.redSub(a);
          if (0 === s.cmpn(0))
            return 0 !== u.cmpn(0)
              ? this.curve.jpoint(null, null, null)
              : this.dbl();
          var c = s.redSqr(),
            f = c.redMul(s),
            l = n.redMul(c),
            d = u.redSqr().redIAdd(f).redISub(l).redISub(l),
            h = u.redMul(l.redISub(d)).redISub(o.redMul(f)),
            p = this.z.redMul(e.z).redMul(s);
          return this.curve.jpoint(d, h, p);
        }),
        (f.prototype.mixedAdd = function (e) {
          if (this.isInfinity()) return e.toJ();
          if (e.isInfinity()) return this;
          var t = this.z.redSqr(),
            r = this.x,
            n = e.x.redMul(t),
            i = this.y,
            o = e.y.redMul(t).redMul(this.z),
            a = r.redSub(n),
            s = i.redSub(o);
          if (0 === a.cmpn(0))
            return 0 !== s.cmpn(0)
              ? this.curve.jpoint(null, null, null)
              : this.dbl();
          var u = a.redSqr(),
            c = u.redMul(a),
            f = r.redMul(u),
            l = s.redSqr().redIAdd(c).redISub(f).redISub(f),
            d = s.redMul(f.redISub(l)).redISub(i.redMul(c)),
            h = this.z.redMul(a);
          return this.curve.jpoint(l, d, h);
        }),
        (f.prototype.dblp = function (e) {
          if (0 === e) return this;
          if (this.isInfinity()) return this;
          if (!e) return this.dbl();
          if (this.curve.zeroA || this.curve.threeA) {
            for (var t = this, r = 0; r < e; r++) t = t.dbl();
            return t;
          }
          var n = this.curve.a,
            i = this.curve.tinv,
            o = this.x,
            a = this.y,
            s = this.z,
            u = s.redSqr().redSqr(),
            c = a.redAdd(a);
          for (r = 0; r < e; r++) {
            var f = o.redSqr(),
              l = c.redSqr(),
              d = l.redSqr(),
              h = f.redAdd(f).redIAdd(f).redIAdd(n.redMul(u)),
              p = o.redMul(l),
              m = h.redSqr().redISub(p.redAdd(p)),
              b = p.redISub(m),
              g = h.redMul(b);
            g = g.redIAdd(g).redISub(d);
            var v = c.redMul(s);
            r + 1 < e && (u = u.redMul(d)), (o = m), (s = v), (c = g);
          }
          return this.curve.jpoint(o, c.redMul(i), s);
        }),
        (f.prototype.dbl = function () {
          return this.isInfinity()
            ? this
            : this.curve.zeroA
            ? this._zeroDbl()
            : this.curve.threeA
            ? this._threeDbl()
            : this._dbl();
        }),
        (f.prototype._zeroDbl = function () {
          var e, t, r;
          if (this.zOne) {
            var n = this.x.redSqr(),
              i = this.y.redSqr(),
              o = i.redSqr(),
              a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
            a = a.redIAdd(a);
            var s = n.redAdd(n).redIAdd(n),
              u = s.redSqr().redISub(a).redISub(a),
              c = o.redIAdd(o);
            (c = (c = c.redIAdd(c)).redIAdd(c)),
              (e = u),
              (t = s.redMul(a.redISub(u)).redISub(c)),
              (r = this.y.redAdd(this.y));
          } else {
            var f = this.x.redSqr(),
              l = this.y.redSqr(),
              d = l.redSqr(),
              h = this.x.redAdd(l).redSqr().redISub(f).redISub(d);
            h = h.redIAdd(h);
            var p = f.redAdd(f).redIAdd(f),
              m = p.redSqr(),
              b = d.redIAdd(d);
            (b = (b = b.redIAdd(b)).redIAdd(b)),
              (e = m.redISub(h).redISub(h)),
              (t = p.redMul(h.redISub(e)).redISub(b)),
              (r = (r = this.y.redMul(this.z)).redIAdd(r));
          }
          return this.curve.jpoint(e, t, r);
        }),
        (f.prototype._threeDbl = function () {
          var e, t, r;
          if (this.zOne) {
            var n = this.x.redSqr(),
              i = this.y.redSqr(),
              o = i.redSqr(),
              a = this.x.redAdd(i).redSqr().redISub(n).redISub(o);
            a = a.redIAdd(a);
            var s = n.redAdd(n).redIAdd(n).redIAdd(this.curve.a),
              u = s.redSqr().redISub(a).redISub(a);
            e = u;
            var c = o.redIAdd(o);
            (c = (c = c.redIAdd(c)).redIAdd(c)),
              (t = s.redMul(a.redISub(u)).redISub(c)),
              (r = this.y.redAdd(this.y));
          } else {
            var f = this.z.redSqr(),
              l = this.y.redSqr(),
              d = this.x.redMul(l),
              h = this.x.redSub(f).redMul(this.x.redAdd(f));
            h = h.redAdd(h).redIAdd(h);
            var p = d.redIAdd(d),
              m = (p = p.redIAdd(p)).redAdd(p);
            (e = h.redSqr().redISub(m)),
              (r = this.y.redAdd(this.z).redSqr().redISub(l).redISub(f));
            var b = l.redSqr();
            (b = (b = (b = b.redIAdd(b)).redIAdd(b)).redIAdd(b)),
              (t = h.redMul(p.redISub(e)).redISub(b));
          }
          return this.curve.jpoint(e, t, r);
        }),
        (f.prototype._dbl = function () {
          var e = this.curve.a,
            t = this.x,
            r = this.y,
            n = this.z,
            i = n.redSqr().redSqr(),
            o = t.redSqr(),
            a = r.redSqr(),
            s = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(i)),
            u = t.redAdd(t),
            c = (u = u.redIAdd(u)).redMul(a),
            f = s.redSqr().redISub(c.redAdd(c)),
            l = c.redISub(f),
            d = a.redSqr();
          d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
          var h = s.redMul(l).redISub(d),
            p = r.redAdd(r).redMul(n);
          return this.curve.jpoint(f, h, p);
        }),
        (f.prototype.trpl = function () {
          if (!this.curve.zeroA) return this.dbl().add(this);
          var e = this.x.redSqr(),
            t = this.y.redSqr(),
            r = this.z.redSqr(),
            n = t.redSqr(),
            i = e.redAdd(e).redIAdd(e),
            o = i.redSqr(),
            a = this.x.redAdd(t).redSqr().redISub(e).redISub(n),
            s = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(
              o
            )).redSqr(),
            u = n.redIAdd(n);
          u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
          var c = i.redIAdd(a).redSqr().redISub(o).redISub(s).redISub(u),
            f = t.redMul(c);
          f = (f = f.redIAdd(f)).redIAdd(f);
          var l = this.x.redMul(s).redISub(f);
          l = (l = l.redIAdd(l)).redIAdd(l);
          var d = this.y.redMul(c.redMul(u.redISub(c)).redISub(a.redMul(s)));
          d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
          var h = this.z.redAdd(a).redSqr().redISub(r).redISub(s);
          return this.curve.jpoint(l, d, h);
        }),
        (f.prototype.mul = function (e, t) {
          return (e = new i(e, t)), this.curve._wnafMul(this, e);
        }),
        (f.prototype.eq = function (e) {
          if ('affine' === e.type) return this.eq(e.toJ());
          if (this === e) return !0;
          var t = this.z.redSqr(),
            r = e.z.redSqr();
          if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
          var n = t.redMul(this.z),
            i = r.redMul(e.z);
          return 0 === this.y.redMul(i).redISub(e.y.redMul(n)).cmpn(0);
        }),
        (f.prototype.eqXToP = function (e) {
          var t = this.z.redSqr(),
            r = e.toRed(this.curve.red).redMul(t);
          if (0 === this.x.cmp(r)) return !0;
          for (var n = e.clone(), i = this.curve.redN.redMul(t); ; ) {
            if ((n.iadd(this.curve.n), n.cmp(this.curve.p) >= 0)) return !1;
            if ((r.redIAdd(i), 0 === this.x.cmp(r))) return !0;
          }
        }),
        (f.prototype.inspect = function () {
          return this.isInfinity()
            ? '<EC JPoint Infinity>'
            : '<EC JPoint x: ' +
                this.x.toString(16, 2) +
                ' y: ' +
                this.y.toString(16, 2) +
                ' z: ' +
                this.z.toString(16, 2) +
                '>';
        }),
        (f.prototype.isInfinity = function () {
          return 0 === this.z.cmpn(0);
        });
    },
    function (e, t) {
      'function' == typeof Object.create
        ? (e.exports = function (e, t) {
            t &&
              ((e.super_ = t),
              (e.prototype = Object.create(t.prototype, {
                constructor: {
                  value: e,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })));
          })
        : (e.exports = function (e, t) {
            if (t) {
              e.super_ = t;
              var r = function () {};
              (r.prototype = t.prototype),
                (e.prototype = new r()),
                (e.prototype.constructor = e);
            }
          });
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(25),
        o = r(44),
        a = r(7);
      function s(e) {
        o.call(this, 'mont', e),
          (this.a = new n(e.a, 16).toRed(this.red)),
          (this.b = new n(e.b, 16).toRed(this.red)),
          (this.i4 = new n(4).toRed(this.red).redInvm()),
          (this.two = new n(2).toRed(this.red)),
          (this.a24 = this.i4.redMul(this.a.redAdd(this.two)));
      }
      function u(e, t, r) {
        o.BasePoint.call(this, e, 'projective'),
          null === t && null === r
            ? ((this.x = this.curve.one), (this.z = this.curve.zero))
            : ((this.x = new n(t, 16)),
              (this.z = new n(r, 16)),
              this.x.red || (this.x = this.x.toRed(this.curve.red)),
              this.z.red || (this.z = this.z.toRed(this.curve.red)));
      }
      i(s, o),
        (e.exports = s),
        (s.prototype.validate = function (e) {
          var t = e.normalize().x,
            r = t.redSqr(),
            n = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
          return 0 === n.redSqrt().redSqr().cmp(n);
        }),
        i(u, o.BasePoint),
        (s.prototype.decodePoint = function (e, t) {
          return this.point(a.toArray(e, t), 1);
        }),
        (s.prototype.point = function (e, t) {
          return new u(this, e, t);
        }),
        (s.prototype.pointFromJSON = function (e) {
          return u.fromJSON(this, e);
        }),
        (u.prototype.precompute = function () {}),
        (u.prototype._encode = function () {
          return this.getX().toArray('be', this.curve.p.byteLength());
        }),
        (u.fromJSON = function (e, t) {
          return new u(e, t[0], t[1] || e.one);
        }),
        (u.prototype.inspect = function () {
          return this.isInfinity()
            ? '<EC Point Infinity>'
            : '<EC Point x: ' +
                this.x.fromRed().toString(16, 2) +
                ' z: ' +
                this.z.fromRed().toString(16, 2) +
                '>';
        }),
        (u.prototype.isInfinity = function () {
          return 0 === this.z.cmpn(0);
        }),
        (u.prototype.dbl = function () {
          var e = this.x.redAdd(this.z).redSqr(),
            t = this.x.redSub(this.z).redSqr(),
            r = e.redSub(t),
            n = e.redMul(t),
            i = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
          return this.curve.point(n, i);
        }),
        (u.prototype.add = function () {
          throw new Error('Not supported on Montgomery curve');
        }),
        (u.prototype.diffAdd = function (e, t) {
          var r = this.x.redAdd(this.z),
            n = this.x.redSub(this.z),
            i = e.x.redAdd(e.z),
            o = e.x.redSub(e.z).redMul(r),
            a = i.redMul(n),
            s = t.z.redMul(o.redAdd(a).redSqr()),
            u = t.x.redMul(o.redISub(a).redSqr());
          return this.curve.point(s, u);
        }),
        (u.prototype.mul = function (e) {
          for (
            var t = e.clone(),
              r = this,
              n = this.curve.point(null, null),
              i = [];
            0 !== t.cmpn(0);
            t.iushrn(1)
          )
            i.push(t.andln(1));
          for (var o = i.length - 1; o >= 0; o--)
            0 === i[o]
              ? ((r = r.diffAdd(n, this)), (n = n.dbl()))
              : ((n = r.diffAdd(n, this)), (r = r.dbl()));
          return n;
        }),
        (u.prototype.mulAdd = function () {
          throw new Error('Not supported on Montgomery curve');
        }),
        (u.prototype.jumlAdd = function () {
          throw new Error('Not supported on Montgomery curve');
        }),
        (u.prototype.eq = function (e) {
          return 0 === this.getX().cmp(e.getX());
        }),
        (u.prototype.normalize = function () {
          return (
            (this.x = this.x.redMul(this.z.redInvm())),
            (this.z = this.curve.one),
            this
          );
        }),
        (u.prototype.getX = function () {
          return this.normalize(), this.x.fromRed();
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(7),
        i = r(14),
        o = r(25),
        a = r(44),
        s = n.assert;
      function u(e) {
        (this.twisted = 1 != (0 | e.a)),
          (this.mOneA = this.twisted && -1 == (0 | e.a)),
          (this.extended = this.mOneA),
          a.call(this, 'edwards', e),
          (this.a = new i(e.a, 16).umod(this.red.m)),
          (this.a = this.a.toRed(this.red)),
          (this.c = new i(e.c, 16).toRed(this.red)),
          (this.c2 = this.c.redSqr()),
          (this.d = new i(e.d, 16).toRed(this.red)),
          (this.dd = this.d.redAdd(this.d)),
          s(!this.twisted || 0 === this.c.fromRed().cmpn(1)),
          (this.oneC = 1 == (0 | e.c));
      }
      function c(e, t, r, n, o) {
        a.BasePoint.call(this, e, 'projective'),
          null === t && null === r && null === n
            ? ((this.x = this.curve.zero),
              (this.y = this.curve.one),
              (this.z = this.curve.one),
              (this.t = this.curve.zero),
              (this.zOne = !0))
            : ((this.x = new i(t, 16)),
              (this.y = new i(r, 16)),
              (this.z = n ? new i(n, 16) : this.curve.one),
              (this.t = o && new i(o, 16)),
              this.x.red || (this.x = this.x.toRed(this.curve.red)),
              this.y.red || (this.y = this.y.toRed(this.curve.red)),
              this.z.red || (this.z = this.z.toRed(this.curve.red)),
              this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)),
              (this.zOne = this.z === this.curve.one),
              this.curve.extended &&
                !this.t &&
                ((this.t = this.x.redMul(this.y)),
                this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
      }
      o(u, a),
        (e.exports = u),
        (u.prototype._mulA = function (e) {
          return this.mOneA ? e.redNeg() : this.a.redMul(e);
        }),
        (u.prototype._mulC = function (e) {
          return this.oneC ? e : this.c.redMul(e);
        }),
        (u.prototype.jpoint = function (e, t, r, n) {
          return this.point(e, t, r, n);
        }),
        (u.prototype.pointFromX = function (e, t) {
          (e = new i(e, 16)).red || (e = e.toRed(this.red));
          var r = e.redSqr(),
            n = this.c2.redSub(this.a.redMul(r)),
            o = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
            a = n.redMul(o.redInvm()),
            s = a.redSqrt();
          if (0 !== s.redSqr().redSub(a).cmp(this.zero))
            throw new Error('invalid point');
          var u = s.fromRed().isOdd();
          return ((t && !u) || (!t && u)) && (s = s.redNeg()), this.point(e, s);
        }),
        (u.prototype.pointFromY = function (e, t) {
          (e = new i(e, 16)).red || (e = e.toRed(this.red));
          var r = e.redSqr(),
            n = r.redSub(this.c2),
            o = r.redMul(this.d).redMul(this.c2).redSub(this.a),
            a = n.redMul(o.redInvm());
          if (0 === a.cmp(this.zero)) {
            if (t) throw new Error('invalid point');
            return this.point(this.zero, e);
          }
          var s = a.redSqrt();
          if (0 !== s.redSqr().redSub(a).cmp(this.zero))
            throw new Error('invalid point');
          return (
            s.fromRed().isOdd() !== t && (s = s.redNeg()), this.point(s, e)
          );
        }),
        (u.prototype.validate = function (e) {
          if (e.isInfinity()) return !0;
          e.normalize();
          var t = e.x.redSqr(),
            r = e.y.redSqr(),
            n = t.redMul(this.a).redAdd(r),
            i = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
          return 0 === n.cmp(i);
        }),
        o(c, a.BasePoint),
        (u.prototype.pointFromJSON = function (e) {
          return c.fromJSON(this, e);
        }),
        (u.prototype.point = function (e, t, r, n) {
          return new c(this, e, t, r, n);
        }),
        (c.fromJSON = function (e, t) {
          return new c(e, t[0], t[1], t[2]);
        }),
        (c.prototype.inspect = function () {
          return this.isInfinity()
            ? '<EC Point Infinity>'
            : '<EC Point x: ' +
                this.x.fromRed().toString(16, 2) +
                ' y: ' +
                this.y.fromRed().toString(16, 2) +
                ' z: ' +
                this.z.fromRed().toString(16, 2) +
                '>';
        }),
        (c.prototype.isInfinity = function () {
          return (
            0 === this.x.cmpn(0) &&
            (0 === this.y.cmp(this.z) ||
              (this.zOne && 0 === this.y.cmp(this.curve.c)))
          );
        }),
        (c.prototype._extDbl = function () {
          var e = this.x.redSqr(),
            t = this.y.redSqr(),
            r = this.z.redSqr();
          r = r.redIAdd(r);
          var n = this.curve._mulA(e),
            i = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t),
            o = n.redAdd(t),
            a = o.redSub(r),
            s = n.redSub(t),
            u = i.redMul(a),
            c = o.redMul(s),
            f = i.redMul(s),
            l = a.redMul(o);
          return this.curve.point(u, c, l, f);
        }),
        (c.prototype._projDbl = function () {
          var e,
            t,
            r,
            n = this.x.redAdd(this.y).redSqr(),
            i = this.x.redSqr(),
            o = this.y.redSqr();
          if (this.curve.twisted) {
            var a = (c = this.curve._mulA(i)).redAdd(o);
            if (this.zOne)
              (e = n.redSub(i).redSub(o).redMul(a.redSub(this.curve.two))),
                (t = a.redMul(c.redSub(o))),
                (r = a.redSqr().redSub(a).redSub(a));
            else {
              var s = this.z.redSqr(),
                u = a.redSub(s).redISub(s);
              (e = n.redSub(i).redISub(o).redMul(u)),
                (t = a.redMul(c.redSub(o))),
                (r = a.redMul(u));
            }
          } else {
            var c = i.redAdd(o);
            (s = this.curve._mulC(this.z).redSqr()),
              (u = c.redSub(s).redSub(s));
            (e = this.curve._mulC(n.redISub(c)).redMul(u)),
              (t = this.curve._mulC(c).redMul(i.redISub(o))),
              (r = c.redMul(u));
          }
          return this.curve.point(e, t, r);
        }),
        (c.prototype.dbl = function () {
          return this.isInfinity()
            ? this
            : this.curve.extended
            ? this._extDbl()
            : this._projDbl();
        }),
        (c.prototype._extAdd = function (e) {
          var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)),
            r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
            n = this.t.redMul(this.curve.dd).redMul(e.t),
            i = this.z.redMul(e.z.redAdd(e.z)),
            o = r.redSub(t),
            a = i.redSub(n),
            s = i.redAdd(n),
            u = r.redAdd(t),
            c = o.redMul(a),
            f = s.redMul(u),
            l = o.redMul(u),
            d = a.redMul(s);
          return this.curve.point(c, f, d, l);
        }),
        (c.prototype._projAdd = function (e) {
          var t,
            r,
            n = this.z.redMul(e.z),
            i = n.redSqr(),
            o = this.x.redMul(e.x),
            a = this.y.redMul(e.y),
            s = this.curve.d.redMul(o).redMul(a),
            u = i.redSub(s),
            c = i.redAdd(s),
            f = this.x
              .redAdd(this.y)
              .redMul(e.x.redAdd(e.y))
              .redISub(o)
              .redISub(a),
            l = n.redMul(u).redMul(f);
          return (
            this.curve.twisted
              ? ((t = n.redMul(c).redMul(a.redSub(this.curve._mulA(o)))),
                (r = u.redMul(c)))
              : ((t = n.redMul(c).redMul(a.redSub(o))),
                (r = this.curve._mulC(u).redMul(c))),
            this.curve.point(l, t, r)
          );
        }),
        (c.prototype.add = function (e) {
          return this.isInfinity()
            ? e
            : e.isInfinity()
            ? this
            : this.curve.extended
            ? this._extAdd(e)
            : this._projAdd(e);
        }),
        (c.prototype.mul = function (e) {
          return this._hasDoubles(e)
            ? this.curve._fixedNafMul(this, e)
            : this.curve._wnafMul(this, e);
        }),
        (c.prototype.mulAdd = function (e, t, r) {
          return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1);
        }),
        (c.prototype.jmulAdd = function (e, t, r) {
          return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0);
        }),
        (c.prototype.normalize = function () {
          if (this.zOne) return this;
          var e = this.z.redInvm();
          return (
            (this.x = this.x.redMul(e)),
            (this.y = this.y.redMul(e)),
            this.t && (this.t = this.t.redMul(e)),
            (this.z = this.curve.one),
            (this.zOne = !0),
            this
          );
        }),
        (c.prototype.neg = function () {
          return this.curve.point(
            this.x.redNeg(),
            this.y,
            this.z,
            this.t && this.t.redNeg()
          );
        }),
        (c.prototype.getX = function () {
          return this.normalize(), this.x.fromRed();
        }),
        (c.prototype.getY = function () {
          return this.normalize(), this.y.fromRed();
        }),
        (c.prototype.eq = function (e) {
          return (
            this === e ||
            (0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY()))
          );
        }),
        (c.prototype.eqXToP = function (e) {
          var t = e.toRed(this.curve.red).redMul(this.z);
          if (0 === this.x.cmp(t)) return !0;
          for (var r = e.clone(), n = this.curve.redN.redMul(this.z); ; ) {
            if ((r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0)) return !1;
            if ((t.redIAdd(n), 0 === this.x.cmp(t))) return !0;
          }
        }),
        (c.prototype.toP = c.prototype.normalize),
        (c.prototype.mixedAdd = c.prototype.add);
    },
    function (e, t, r) {
      'use strict';
      (t.sha1 = r(163)),
        (t.sha224 = r(164)),
        (t.sha256 = r(90)),
        (t.sha384 = r(165)),
        (t.sha512 = r(91));
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(36),
        o = r(89),
        a = n.rotl32,
        s = n.sum32,
        u = n.sum32_5,
        c = o.ft_1,
        f = i.BlockHash,
        l = [1518500249, 1859775393, 2400959708, 3395469782];
      function d() {
        if (!(this instanceof d)) return new d();
        f.call(this),
          (this.h = [
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520,
          ]),
          (this.W = new Array(80));
      }
      n.inherits(d, f),
        (e.exports = d),
        (d.blockSize = 512),
        (d.outSize = 160),
        (d.hmacStrength = 80),
        (d.padLength = 64),
        (d.prototype._update = function (e, t) {
          for (var r = this.W, n = 0; n < 16; n++) r[n] = e[t + n];
          for (; n < r.length; n++)
            r[n] = a(r[n - 3] ^ r[n - 8] ^ r[n - 14] ^ r[n - 16], 1);
          var i = this.h[0],
            o = this.h[1],
            f = this.h[2],
            d = this.h[3],
            h = this.h[4];
          for (n = 0; n < r.length; n++) {
            var p = ~~(n / 20),
              m = u(a(i, 5), c(p, o, f, d), h, r[n], l[p]);
            (h = d), (d = f), (f = a(o, 30)), (o = i), (i = m);
          }
          (this.h[0] = s(this.h[0], i)),
            (this.h[1] = s(this.h[1], o)),
            (this.h[2] = s(this.h[2], f)),
            (this.h[3] = s(this.h[3], d)),
            (this.h[4] = s(this.h[4], h));
        }),
        (d.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h, 'big')
            : n.split32(this.h, 'big');
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(90);
      function o() {
        if (!(this instanceof o)) return new o();
        i.call(this),
          (this.h = [
            3238371032,
            914150663,
            812702999,
            4144912697,
            4290775857,
            1750603025,
            1694076839,
            3204075428,
          ]);
      }
      n.inherits(o, i),
        (e.exports = o),
        (o.blockSize = 512),
        (o.outSize = 224),
        (o.hmacStrength = 192),
        (o.padLength = 64),
        (o.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h.slice(0, 7), 'big')
            : n.split32(this.h.slice(0, 7), 'big');
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(91);
      function o() {
        if (!(this instanceof o)) return new o();
        i.call(this),
          (this.h = [
            3418070365,
            3238371032,
            1654270250,
            914150663,
            2438529370,
            812702999,
            355462360,
            4144912697,
            1731405415,
            4290775857,
            2394180231,
            1750603025,
            3675008525,
            1694076839,
            1203062813,
            3204075428,
          ]);
      }
      n.inherits(o, i),
        (e.exports = o),
        (o.blockSize = 1024),
        (o.outSize = 384),
        (o.hmacStrength = 192),
        (o.padLength = 128),
        (o.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h.slice(0, 12), 'big')
            : n.split32(this.h.slice(0, 12), 'big');
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(36),
        o = n.rotl32,
        a = n.sum32,
        s = n.sum32_3,
        u = n.sum32_4,
        c = i.BlockHash;
      function f() {
        if (!(this instanceof f)) return new f();
        c.call(this),
          (this.h = [
            1732584193,
            4023233417,
            2562383102,
            271733878,
            3285377520,
          ]),
          (this.endian = 'little');
      }
      function l(e, t, r, n) {
        return e <= 15
          ? t ^ r ^ n
          : e <= 31
          ? (t & r) | (~t & n)
          : e <= 47
          ? (t | ~r) ^ n
          : e <= 63
          ? (t & n) | (r & ~n)
          : t ^ (r | ~n);
      }
      function d(e) {
        return e <= 15
          ? 0
          : e <= 31
          ? 1518500249
          : e <= 47
          ? 1859775393
          : e <= 63
          ? 2400959708
          : 2840853838;
      }
      function h(e) {
        return e <= 15
          ? 1352829926
          : e <= 31
          ? 1548603684
          : e <= 47
          ? 1836072691
          : e <= 63
          ? 2053994217
          : 0;
      }
      n.inherits(f, c),
        (t.ripemd160 = f),
        (f.blockSize = 512),
        (f.outSize = 160),
        (f.hmacStrength = 192),
        (f.padLength = 64),
        (f.prototype._update = function (e, t) {
          for (
            var r = this.h[0],
              n = this.h[1],
              i = this.h[2],
              c = this.h[3],
              f = this.h[4],
              v = r,
              y = n,
              w = i,
              _ = c,
              S = f,
              M = 0;
            M < 80;
            M++
          ) {
            var E = a(o(u(r, l(M, n, i, c), e[p[M] + t], d(M)), b[M]), f);
            (r = f),
              (f = c),
              (c = o(i, 10)),
              (i = n),
              (n = E),
              (E = a(o(u(v, l(79 - M, y, w, _), e[m[M] + t], h(M)), g[M]), S)),
              (v = S),
              (S = _),
              (_ = o(w, 10)),
              (w = y),
              (y = E);
          }
          (E = s(this.h[1], i, _)),
            (this.h[1] = s(this.h[2], c, S)),
            (this.h[2] = s(this.h[3], f, v)),
            (this.h[3] = s(this.h[4], r, y)),
            (this.h[4] = s(this.h[0], n, w)),
            (this.h[0] = E);
        }),
        (f.prototype._digest = function (e) {
          return 'hex' === e
            ? n.toHex32(this.h, 'little')
            : n.split32(this.h, 'little');
        });
      var p = [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          7,
          4,
          13,
          1,
          10,
          6,
          15,
          3,
          12,
          0,
          9,
          5,
          2,
          14,
          11,
          8,
          3,
          10,
          14,
          4,
          9,
          15,
          8,
          1,
          2,
          7,
          0,
          6,
          13,
          11,
          5,
          12,
          1,
          9,
          11,
          10,
          0,
          8,
          12,
          4,
          13,
          3,
          7,
          15,
          14,
          5,
          6,
          2,
          4,
          0,
          5,
          9,
          7,
          12,
          2,
          10,
          14,
          1,
          3,
          8,
          11,
          6,
          15,
          13,
        ],
        m = [
          5,
          14,
          7,
          0,
          9,
          2,
          11,
          4,
          13,
          6,
          15,
          8,
          1,
          10,
          3,
          12,
          6,
          11,
          3,
          7,
          0,
          13,
          5,
          10,
          14,
          15,
          8,
          12,
          4,
          9,
          1,
          2,
          15,
          5,
          1,
          3,
          7,
          14,
          6,
          9,
          11,
          8,
          12,
          2,
          10,
          0,
          4,
          13,
          8,
          6,
          4,
          1,
          3,
          11,
          15,
          0,
          5,
          12,
          2,
          13,
          9,
          7,
          10,
          14,
          12,
          15,
          10,
          4,
          1,
          5,
          8,
          7,
          6,
          2,
          13,
          14,
          0,
          3,
          9,
          11,
        ],
        b = [
          11,
          14,
          15,
          12,
          5,
          8,
          7,
          9,
          11,
          13,
          14,
          15,
          6,
          7,
          9,
          8,
          7,
          6,
          8,
          13,
          11,
          9,
          7,
          15,
          7,
          12,
          15,
          9,
          11,
          7,
          13,
          12,
          11,
          13,
          6,
          7,
          14,
          9,
          13,
          15,
          14,
          8,
          13,
          6,
          5,
          12,
          7,
          5,
          11,
          12,
          14,
          15,
          14,
          15,
          9,
          8,
          9,
          14,
          5,
          6,
          8,
          6,
          5,
          12,
          9,
          15,
          5,
          11,
          6,
          8,
          13,
          12,
          5,
          12,
          13,
          14,
          11,
          8,
          5,
          6,
        ],
        g = [
          8,
          9,
          9,
          11,
          13,
          15,
          15,
          5,
          7,
          7,
          8,
          11,
          14,
          14,
          12,
          6,
          9,
          13,
          15,
          7,
          12,
          8,
          9,
          11,
          7,
          7,
          12,
          7,
          6,
          15,
          13,
          11,
          9,
          7,
          15,
          11,
          8,
          6,
          6,
          14,
          12,
          13,
          5,
          14,
          13,
          13,
          7,
          5,
          15,
          5,
          8,
          11,
          14,
          14,
          6,
          14,
          6,
          9,
          12,
          9,
          12,
          5,
          15,
          8,
          8,
          5,
          12,
          9,
          12,
          5,
          14,
          6,
          8,
          13,
          6,
          5,
          15,
          13,
          11,
          11,
        ];
    },
    function (e, t, r) {
      'use strict';
      var n = r(15),
        i = r(24);
      function o(e, t, r) {
        if (!(this instanceof o)) return new o(e, t, r);
        (this.Hash = e),
          (this.blockSize = e.blockSize / 8),
          (this.outSize = e.outSize / 8),
          (this.inner = null),
          (this.outer = null),
          this._init(n.toArray(t, r));
      }
      (e.exports = o),
        (o.prototype._init = function (e) {
          e.length > this.blockSize && (e = new this.Hash().update(e).digest()),
            i(e.length <= this.blockSize);
          for (var t = e.length; t < this.blockSize; t++) e.push(0);
          for (t = 0; t < e.length; t++) e[t] ^= 54;
          for (this.inner = new this.Hash().update(e), t = 0; t < e.length; t++)
            e[t] ^= 106;
          this.outer = new this.Hash().update(e);
        }),
        (o.prototype.update = function (e, t) {
          return this.inner.update(e, t), this;
        }),
        (o.prototype.digest = function (e) {
          return this.outer.update(this.inner.digest()), this.outer.digest(e);
        });
    },
    function (e, t) {
      e.exports = {
        doubles: {
          step: 4,
          points: [
            [
              'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
              'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821',
            ],
            [
              '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
              '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf',
            ],
            [
              '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
              'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695',
            ],
            [
              '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
              '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9',
            ],
            [
              '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
              '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36',
            ],
            [
              '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
              '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f',
            ],
            [
              'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
              '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999',
            ],
            [
              '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
              'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09',
            ],
            [
              'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
              '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d',
            ],
            [
              'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
              'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088',
            ],
            [
              'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
              '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d',
            ],
            [
              '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
              '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8',
            ],
            [
              '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
              '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a',
            ],
            [
              '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
              '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453',
            ],
            [
              '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
              '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160',
            ],
            [
              '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
              '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0',
            ],
            [
              '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
              '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6',
            ],
            [
              '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
              '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589',
            ],
            [
              '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
              'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17',
            ],
            [
              'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
              '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda',
            ],
            [
              'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
              '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd',
            ],
            [
              '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
              '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2',
            ],
            [
              '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
              '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6',
            ],
            [
              'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
              '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f',
            ],
            [
              '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
              'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01',
            ],
            [
              'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
              '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3',
            ],
            [
              'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
              'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f',
            ],
            [
              'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
              '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7',
            ],
            [
              'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
              'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78',
            ],
            [
              'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
              '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1',
            ],
            [
              '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
              'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150',
            ],
            [
              '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
              '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82',
            ],
            [
              'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
              '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc',
            ],
            [
              '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
              'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b',
            ],
            [
              'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
              '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51',
            ],
            [
              'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
              '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45',
            ],
            [
              'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
              'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120',
            ],
            [
              '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
              '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84',
            ],
            [
              '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
              '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d',
            ],
            [
              '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
              'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d',
            ],
            [
              '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
              '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8',
            ],
            [
              'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
              '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8',
            ],
            [
              '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
              '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac',
            ],
            [
              '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
              'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f',
            ],
            [
              '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
              '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962',
            ],
            [
              'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
              '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907',
            ],
            [
              '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
              'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec',
            ],
            [
              'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
              'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d',
            ],
            [
              'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
              '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414',
            ],
            [
              '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
              'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd',
            ],
            [
              '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
              'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0',
            ],
            [
              'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
              '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811',
            ],
            [
              'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
              '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1',
            ],
            [
              'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
              '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c',
            ],
            [
              '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
              'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73',
            ],
            [
              '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
              '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd',
            ],
            [
              'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
              'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405',
            ],
            [
              '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
              'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589',
            ],
            [
              '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
              '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e',
            ],
            [
              '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
              '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27',
            ],
            [
              'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
              'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1',
            ],
            [
              '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
              '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482',
            ],
            [
              '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
              '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945',
            ],
            [
              'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
              '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573',
            ],
            [
              'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
              'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82',
            ],
          ],
        },
        naf: {
          wnd: 7,
          points: [
            [
              'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
              '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672',
            ],
            [
              '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
              'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6',
            ],
            [
              '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
              '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da',
            ],
            [
              'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
              'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37',
            ],
            [
              '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
              'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b',
            ],
            [
              'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
              'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81',
            ],
            [
              'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
              '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58',
            ],
            [
              'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
              '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77',
            ],
            [
              '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
              '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a',
            ],
            [
              '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
              '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c',
            ],
            [
              '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
              '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67',
            ],
            [
              '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
              '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402',
            ],
            [
              'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
              'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55',
            ],
            [
              'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
              '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482',
            ],
            [
              '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
              'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82',
            ],
            [
              '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
              'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396',
            ],
            [
              '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
              '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49',
            ],
            [
              '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
              '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf',
            ],
            [
              '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
              '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a',
            ],
            [
              '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
              'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7',
            ],
            [
              'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
              'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933',
            ],
            [
              '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
              '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a',
            ],
            [
              '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
              '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6',
            ],
            [
              'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
              'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37',
            ],
            [
              '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
              '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e',
            ],
            [
              'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
              'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6',
            ],
            [
              'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
              'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476',
            ],
            [
              '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
              '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40',
            ],
            [
              '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
              '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61',
            ],
            [
              '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
              '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683',
            ],
            [
              'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
              '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5',
            ],
            [
              '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
              '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b',
            ],
            [
              'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
              '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417',
            ],
            [
              '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
              'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868',
            ],
            [
              '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
              'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a',
            ],
            [
              'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
              'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6',
            ],
            [
              '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
              '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996',
            ],
            [
              '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
              'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e',
            ],
            [
              'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
              'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d',
            ],
            [
              '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
              '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2',
            ],
            [
              '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
              'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e',
            ],
            [
              '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
              '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437',
            ],
            [
              '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
              'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311',
            ],
            [
              'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
              '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4',
            ],
            [
              '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
              '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575',
            ],
            [
              '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
              'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d',
            ],
            [
              '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
              'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d',
            ],
            [
              'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
              'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629',
            ],
            [
              'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
              'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06',
            ],
            [
              '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
              '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374',
            ],
            [
              '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
              '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee',
            ],
            [
              'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
              '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1',
            ],
            [
              'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
              'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b',
            ],
            [
              '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
              '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661',
            ],
            [
              '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
              '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6',
            ],
            [
              'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
              '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e',
            ],
            [
              '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
              '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d',
            ],
            [
              'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
              'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc',
            ],
            [
              '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
              'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4',
            ],
            [
              '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
              '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c',
            ],
            [
              'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
              '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b',
            ],
            [
              'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
              '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913',
            ],
            [
              '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
              '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154',
            ],
            [
              '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
              '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865',
            ],
            [
              '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
              'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc',
            ],
            [
              '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
              'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224',
            ],
            [
              '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
              '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e',
            ],
            [
              '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
              '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6',
            ],
            [
              '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
              '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511',
            ],
            [
              '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
              'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b',
            ],
            [
              'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
              'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2',
            ],
            [
              '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
              'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c',
            ],
            [
              'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
              '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3',
            ],
            [
              'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
              '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d',
            ],
            [
              'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
              '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700',
            ],
            [
              'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
              '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4',
            ],
            [
              '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
              'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196',
            ],
            [
              '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
              '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4',
            ],
            [
              '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
              'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257',
            ],
            [
              'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
              'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13',
            ],
            [
              'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
              '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096',
            ],
            [
              'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
              'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38',
            ],
            [
              'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
              '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f',
            ],
            [
              '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
              '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448',
            ],
            [
              'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
              '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a',
            ],
            [
              'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
              '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4',
            ],
            [
              '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
              '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437',
            ],
            [
              '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
              'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7',
            ],
            [
              'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
              '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d',
            ],
            [
              'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
              '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a',
            ],
            [
              'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
              '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54',
            ],
            [
              '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
              '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77',
            ],
            [
              'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
              'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517',
            ],
            [
              '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
              'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10',
            ],
            [
              'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
              'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125',
            ],
            [
              'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
              '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e',
            ],
            [
              '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
              'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1',
            ],
            [
              'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
              '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2',
            ],
            [
              'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
              '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423',
            ],
            [
              'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
              '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8',
            ],
            [
              '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
              'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758',
            ],
            [
              '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
              'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375',
            ],
            [
              'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
              '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d',
            ],
            [
              '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
              'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec',
            ],
            [
              '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
              '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0',
            ],
            [
              '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
              'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c',
            ],
            [
              'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
              'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4',
            ],
            [
              '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
              'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f',
            ],
            [
              '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
              '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649',
            ],
            [
              '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
              'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826',
            ],
            [
              '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
              '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5',
            ],
            [
              'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
              'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87',
            ],
            [
              '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
              '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b',
            ],
            [
              'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
              '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc',
            ],
            [
              '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
              '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c',
            ],
            [
              'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
              'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f',
            ],
            [
              'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
              '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a',
            ],
            [
              'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
              'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46',
            ],
            [
              '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
              'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f',
            ],
            [
              '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
              '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03',
            ],
            [
              '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
              'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08',
            ],
            [
              '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
              '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8',
            ],
            [
              '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
              '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373',
            ],
            [
              '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
              'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3',
            ],
            [
              '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
              '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8',
            ],
            [
              '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
              '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1',
            ],
            [
              '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
              '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9',
            ],
          ],
        },
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(170),
        o = r(7),
        a = r(54),
        s = r(87),
        u = o.assert,
        c = r(171),
        f = r(172);
      function l(e) {
        if (!(this instanceof l)) return new l(e);
        'string' == typeof e &&
          (u(a.hasOwnProperty(e), 'Unknown curve ' + e), (e = a[e])),
          e instanceof a.PresetCurve && (e = { curve: e }),
          (this.curve = e.curve.curve),
          (this.n = this.curve.n),
          (this.nh = this.n.ushrn(1)),
          (this.g = this.curve.g),
          (this.g = e.curve.g),
          this.g.precompute(e.curve.n.bitLength() + 1),
          (this.hash = e.hash || e.curve.hash);
      }
      (e.exports = l),
        (l.prototype.keyPair = function (e) {
          return new c(this, e);
        }),
        (l.prototype.keyFromPrivate = function (e, t) {
          return c.fromPrivate(this, e, t);
        }),
        (l.prototype.keyFromPublic = function (e, t) {
          return c.fromPublic(this, e, t);
        }),
        (l.prototype.genKeyPair = function (e) {
          e || (e = {});
          for (
            var t = new i({
                hash: this.hash,
                pers: e.pers,
                persEnc: e.persEnc || 'utf8',
                entropy: e.entropy || s(this.hash.hmacStrength),
                entropyEnc: (e.entropy && e.entropyEnc) || 'utf8',
                nonce: this.n.toArray(),
              }),
              r = this.n.byteLength(),
              o = this.n.sub(new n(2));
            ;

          ) {
            var a = new n(t.generate(r));
            if (!(a.cmp(o) > 0)) return a.iaddn(1), this.keyFromPrivate(a);
          }
        }),
        (l.prototype._truncateToN = function (e, t) {
          var r = 8 * e.byteLength() - this.n.bitLength();
          return (
            r > 0 && (e = e.ushrn(r)),
            !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e
          );
        }),
        (l.prototype.sign = function (e, t, r, o) {
          'object' == typeof r && ((o = r), (r = null)),
            o || (o = {}),
            (t = this.keyFromPrivate(t, r)),
            (e = this._truncateToN(new n(e, 16)));
          for (
            var a = this.n.byteLength(),
              s = t.getPrivate().toArray('be', a),
              u = e.toArray('be', a),
              c = new i({
                hash: this.hash,
                entropy: s,
                nonce: u,
                pers: o.pers,
                persEnc: o.persEnc || 'utf8',
              }),
              l = this.n.sub(new n(1)),
              d = 0;
            ;
            d++
          ) {
            var h = o.k ? o.k(d) : new n(c.generate(this.n.byteLength()));
            if (
              !((h = this._truncateToN(h, !0)).cmpn(1) <= 0 || h.cmp(l) >= 0)
            ) {
              var p = this.g.mul(h);
              if (!p.isInfinity()) {
                var m = p.getX(),
                  b = m.umod(this.n);
                if (0 !== b.cmpn(0)) {
                  var g = h.invm(this.n).mul(b.mul(t.getPrivate()).iadd(e));
                  if (0 !== (g = g.umod(this.n)).cmpn(0)) {
                    var v =
                      (p.getY().isOdd() ? 1 : 0) | (0 !== m.cmp(b) ? 2 : 0);
                    return (
                      o.canonical &&
                        g.cmp(this.nh) > 0 &&
                        ((g = this.n.sub(g)), (v ^= 1)),
                      new f({ r: b, s: g, recoveryParam: v })
                    );
                  }
                }
              }
            }
          }
        }),
        (l.prototype.verify = function (e, t, r, i) {
          (e = this._truncateToN(new n(e, 16))), (r = this.keyFromPublic(r, i));
          var o = (t = new f(t, 'hex')).r,
            a = t.s;
          if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
          if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0) return !1;
          var s,
            u = a.invm(this.n),
            c = u.mul(e).umod(this.n),
            l = u.mul(o).umod(this.n);
          return this.curve._maxwellTrick
            ? !(s = this.g.jmulAdd(c, r.getPublic(), l)).isInfinity() &&
                s.eqXToP(o)
            : !(s = this.g.mulAdd(c, r.getPublic(), l)).isInfinity() &&
                0 === s.getX().umod(this.n).cmp(o);
        }),
        (l.prototype.recoverPubKey = function (e, t, r, i) {
          u((3 & r) === r, 'The recovery param is more than two bits'),
            (t = new f(t, i));
          var o = this.n,
            a = new n(e),
            s = t.r,
            c = t.s,
            l = 1 & r,
            d = r >> 1;
          if (s.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d)
            throw new Error('Unable to find sencond key candinate');
          s = d
            ? this.curve.pointFromX(s.add(this.curve.n), l)
            : this.curve.pointFromX(s, l);
          var h = t.r.invm(o),
            p = o.sub(a).mul(h).umod(o),
            m = c.mul(h).umod(o);
          return this.g.mulAdd(p, s, m);
        }),
        (l.prototype.getKeyRecoveryParam = function (e, t, r, n) {
          if (null !== (t = new f(t, n)).recoveryParam) return t.recoveryParam;
          for (var i = 0; i < 4; i++) {
            var o;
            try {
              o = this.recoverPubKey(e, t, i);
            } catch (e) {
              continue;
            }
            if (o.eq(r)) return i;
          }
          throw new Error('Unable to find valid recovery factor');
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(55),
        i = r(86),
        o = r(24);
      function a(e) {
        if (!(this instanceof a)) return new a(e);
        (this.hash = e.hash),
          (this.predResist = !!e.predResist),
          (this.outLen = this.hash.outSize),
          (this.minEntropy = e.minEntropy || this.hash.hmacStrength),
          (this._reseed = null),
          (this.reseedInterval = null),
          (this.K = null),
          (this.V = null);
        var t = i.toArray(e.entropy, e.entropyEnc || 'hex'),
          r = i.toArray(e.nonce, e.nonceEnc || 'hex'),
          n = i.toArray(e.pers, e.persEnc || 'hex');
        o(
          t.length >= this.minEntropy / 8,
          'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits'
        ),
          this._init(t, r, n);
      }
      (e.exports = a),
        (a.prototype._init = function (e, t, r) {
          var n = e.concat(t).concat(r);
          (this.K = new Array(this.outLen / 8)),
            (this.V = new Array(this.outLen / 8));
          for (var i = 0; i < this.V.length; i++)
            (this.K[i] = 0), (this.V[i] = 1);
          this._update(n),
            (this._reseed = 1),
            (this.reseedInterval = 281474976710656);
        }),
        (a.prototype._hmac = function () {
          return new n.hmac(this.hash, this.K);
        }),
        (a.prototype._update = function (e) {
          var t = this._hmac().update(this.V).update([0]);
          e && (t = t.update(e)),
            (this.K = t.digest()),
            (this.V = this._hmac().update(this.V).digest()),
            e &&
              ((this.K = this._hmac()
                .update(this.V)
                .update([1])
                .update(e)
                .digest()),
              (this.V = this._hmac().update(this.V).digest()));
        }),
        (a.prototype.reseed = function (e, t, r, n) {
          'string' != typeof t && ((n = r), (r = t), (t = null)),
            (e = i.toArray(e, t)),
            (r = i.toArray(r, n)),
            o(
              e.length >= this.minEntropy / 8,
              'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits'
            ),
            this._update(e.concat(r || [])),
            (this._reseed = 1);
        }),
        (a.prototype.generate = function (e, t, r, n) {
          if (this._reseed > this.reseedInterval)
            throw new Error('Reseed is required');
          'string' != typeof t && ((n = r), (r = t), (t = null)),
            r && ((r = i.toArray(r, n || 'hex')), this._update(r));
          for (var o = []; o.length < e; )
            (this.V = this._hmac().update(this.V).digest()),
              (o = o.concat(this.V));
          var a = o.slice(0, e);
          return this._update(r), this._reseed++, i.encode(a, t);
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(7).assert;
      function o(e, t) {
        (this.ec = e),
          (this.priv = null),
          (this.pub = null),
          t.priv && this._importPrivate(t.priv, t.privEnc),
          t.pub && this._importPublic(t.pub, t.pubEnc);
      }
      (e.exports = o),
        (o.fromPublic = function (e, t, r) {
          return t instanceof o ? t : new o(e, { pub: t, pubEnc: r });
        }),
        (o.fromPrivate = function (e, t, r) {
          return t instanceof o ? t : new o(e, { priv: t, privEnc: r });
        }),
        (o.prototype.validate = function () {
          var e = this.getPublic();
          return e.isInfinity()
            ? { result: !1, reason: 'Invalid public key' }
            : e.validate()
            ? e.mul(this.ec.curve.n).isInfinity()
              ? { result: !0, reason: null }
              : { result: !1, reason: 'Public key * N != O' }
            : { result: !1, reason: 'Public key is not a point' };
        }),
        (o.prototype.getPublic = function (e, t) {
          return (
            'string' == typeof e && ((t = e), (e = null)),
            this.pub || (this.pub = this.ec.g.mul(this.priv)),
            t ? this.pub.encode(t, e) : this.pub
          );
        }),
        (o.prototype.getPrivate = function (e) {
          return 'hex' === e ? this.priv.toString(16, 2) : this.priv;
        }),
        (o.prototype._importPrivate = function (e, t) {
          (this.priv = new n(e, t || 16)),
            (this.priv = this.priv.umod(this.ec.curve.n));
        }),
        (o.prototype._importPublic = function (e, t) {
          if (e.x || e.y)
            return (
              'mont' === this.ec.curve.type
                ? i(e.x, 'Need x coordinate')
                : ('short' !== this.ec.curve.type &&
                    'edwards' !== this.ec.curve.type) ||
                  i(e.x && e.y, 'Need both x and y coordinate'),
              void (this.pub = this.ec.curve.point(e.x, e.y))
            );
          this.pub = this.ec.curve.decodePoint(e, t);
        }),
        (o.prototype.derive = function (e) {
          return e.mul(this.priv).getX();
        }),
        (o.prototype.sign = function (e, t, r) {
          return this.ec.sign(e, this, t, r);
        }),
        (o.prototype.verify = function (e, t) {
          return this.ec.verify(e, t, this);
        }),
        (o.prototype.inspect = function () {
          return (
            '<Key priv: ' +
            (this.priv && this.priv.toString(16, 2)) +
            ' pub: ' +
            (this.pub && this.pub.inspect()) +
            ' >'
          );
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(7),
        o = i.assert;
      function a(e, t) {
        if (e instanceof a) return e;
        this._importDER(e, t) ||
          (o(e.r && e.s, 'Signature without r or s'),
          (this.r = new n(e.r, 16)),
          (this.s = new n(e.s, 16)),
          void 0 === e.recoveryParam
            ? (this.recoveryParam = null)
            : (this.recoveryParam = e.recoveryParam));
      }
      function s() {
        this.place = 0;
      }
      function u(e, t) {
        var r = e[t.place++];
        if (!(128 & r)) return r;
        for (var n = 15 & r, i = 0, o = 0, a = t.place; o < n; o++, a++)
          (i <<= 8), (i |= e[a]);
        return (t.place = a), i;
      }
      function c(e) {
        for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r; )
          t++;
        return 0 === t ? e : e.slice(t);
      }
      function f(e, t) {
        if (t < 128) e.push(t);
        else {
          var r = 1 + ((Math.log(t) / Math.LN2) >>> 3);
          for (e.push(128 | r); --r; ) e.push((t >>> (r << 3)) & 255);
          e.push(t);
        }
      }
      (e.exports = a),
        (a.prototype._importDER = function (e, t) {
          e = i.toArray(e, t);
          var r = new s();
          if (48 !== e[r.place++]) return !1;
          if (u(e, r) + r.place !== e.length) return !1;
          if (2 !== e[r.place++]) return !1;
          var o = u(e, r),
            a = e.slice(r.place, o + r.place);
          if (((r.place += o), 2 !== e[r.place++])) return !1;
          var c = u(e, r);
          if (e.length !== c + r.place) return !1;
          var f = e.slice(r.place, c + r.place);
          return (
            0 === a[0] && 128 & a[1] && (a = a.slice(1)),
            0 === f[0] && 128 & f[1] && (f = f.slice(1)),
            (this.r = new n(a)),
            (this.s = new n(f)),
            (this.recoveryParam = null),
            !0
          );
        }),
        (a.prototype.toDER = function (e) {
          var t = this.r.toArray(),
            r = this.s.toArray();
          for (
            128 & t[0] && (t = [0].concat(t)),
              128 & r[0] && (r = [0].concat(r)),
              t = c(t),
              r = c(r);
            !(r[0] || 128 & r[1]);

          )
            r = r.slice(1);
          var n = [2];
          f(n, t.length), (n = n.concat(t)).push(2), f(n, r.length);
          var o = n.concat(r),
            a = [48];
          return f(a, o.length), (a = a.concat(o)), i.encode(a, e);
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(55),
        i = r(54),
        o = r(7),
        a = o.assert,
        s = o.parseBytes,
        u = r(174),
        c = r(175);
      function f(e) {
        if (
          (a('ed25519' === e, 'only tested with ed25519 so far'),
          !(this instanceof f))
        )
          return new f(e);
        e = i[e].curve;
        (this.curve = e),
          (this.g = e.g),
          this.g.precompute(e.n.bitLength() + 1),
          (this.pointClass = e.point().constructor),
          (this.encodingLength = Math.ceil(e.n.bitLength() / 8)),
          (this.hash = n.sha512);
      }
      (e.exports = f),
        (f.prototype.sign = function (e, t) {
          e = s(e);
          var r = this.keyFromSecret(t),
            n = this.hashInt(r.messagePrefix(), e),
            i = this.g.mul(n),
            o = this.encodePoint(i),
            a = this.hashInt(o, r.pubBytes(), e).mul(r.priv()),
            u = n.add(a).umod(this.curve.n);
          return this.makeSignature({ R: i, S: u, Rencoded: o });
        }),
        (f.prototype.verify = function (e, t, r) {
          (e = s(e)), (t = this.makeSignature(t));
          var n = this.keyFromPublic(r),
            i = this.hashInt(t.Rencoded(), n.pubBytes(), e),
            o = this.g.mul(t.S());
          return t.R().add(n.pub().mul(i)).eq(o);
        }),
        (f.prototype.hashInt = function () {
          for (var e = this.hash(), t = 0; t < arguments.length; t++)
            e.update(arguments[t]);
          return o.intFromLE(e.digest()).umod(this.curve.n);
        }),
        (f.prototype.keyFromPublic = function (e) {
          return u.fromPublic(this, e);
        }),
        (f.prototype.keyFromSecret = function (e) {
          return u.fromSecret(this, e);
        }),
        (f.prototype.makeSignature = function (e) {
          return e instanceof c ? e : new c(this, e);
        }),
        (f.prototype.encodePoint = function (e) {
          var t = e.getY().toArray('le', this.encodingLength);
          return (t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0), t;
        }),
        (f.prototype.decodePoint = function (e) {
          var t = (e = o.parseBytes(e)).length - 1,
            r = e.slice(0, t).concat(-129 & e[t]),
            n = 0 != (128 & e[t]),
            i = o.intFromLE(r);
          return this.curve.pointFromY(i, n);
        }),
        (f.prototype.encodeInt = function (e) {
          return e.toArray('le', this.encodingLength);
        }),
        (f.prototype.decodeInt = function (e) {
          return o.intFromLE(e);
        }),
        (f.prototype.isPoint = function (e) {
          return e instanceof this.pointClass;
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(7),
        i = n.assert,
        o = n.parseBytes,
        a = n.cachedProperty;
      function s(e, t) {
        (this.eddsa = e),
          (this._secret = o(t.secret)),
          e.isPoint(t.pub) ? (this._pub = t.pub) : (this._pubBytes = o(t.pub));
      }
      (s.fromPublic = function (e, t) {
        return t instanceof s ? t : new s(e, { pub: t });
      }),
        (s.fromSecret = function (e, t) {
          return t instanceof s ? t : new s(e, { secret: t });
        }),
        (s.prototype.secret = function () {
          return this._secret;
        }),
        a(s, 'pubBytes', function () {
          return this.eddsa.encodePoint(this.pub());
        }),
        a(s, 'pub', function () {
          return this._pubBytes
            ? this.eddsa.decodePoint(this._pubBytes)
            : this.eddsa.g.mul(this.priv());
        }),
        a(s, 'privBytes', function () {
          var e = this.eddsa,
            t = this.hash(),
            r = e.encodingLength - 1,
            n = t.slice(0, e.encodingLength);
          return (n[0] &= 248), (n[r] &= 127), (n[r] |= 64), n;
        }),
        a(s, 'priv', function () {
          return this.eddsa.decodeInt(this.privBytes());
        }),
        a(s, 'hash', function () {
          return this.eddsa.hash().update(this.secret()).digest();
        }),
        a(s, 'messagePrefix', function () {
          return this.hash().slice(this.eddsa.encodingLength);
        }),
        (s.prototype.sign = function (e) {
          return (
            i(this._secret, 'KeyPair can only verify'), this.eddsa.sign(e, this)
          );
        }),
        (s.prototype.verify = function (e, t) {
          return this.eddsa.verify(e, t, this);
        }),
        (s.prototype.getSecret = function (e) {
          return (
            i(this._secret, 'KeyPair is public only'),
            n.encode(this.secret(), e)
          );
        }),
        (s.prototype.getPublic = function (e) {
          return n.encode(this.pubBytes(), e);
        }),
        (e.exports = s);
    },
    function (e, t, r) {
      'use strict';
      var n = r(14),
        i = r(7),
        o = i.assert,
        a = i.cachedProperty,
        s = i.parseBytes;
      function u(e, t) {
        (this.eddsa = e),
          'object' != typeof t && (t = s(t)),
          Array.isArray(t) &&
            (t = {
              R: t.slice(0, e.encodingLength),
              S: t.slice(e.encodingLength),
            }),
          o(t.R && t.S, 'Signature without R or S'),
          e.isPoint(t.R) && (this._R = t.R),
          t.S instanceof n && (this._S = t.S),
          (this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded),
          (this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded);
      }
      a(u, 'S', function () {
        return this.eddsa.decodeInt(this.Sencoded());
      }),
        a(u, 'R', function () {
          return this.eddsa.decodePoint(this.Rencoded());
        }),
        a(u, 'Rencoded', function () {
          return this.eddsa.encodePoint(this.R());
        }),
        a(u, 'Sencoded', function () {
          return this.eddsa.encodeInt(this.S());
        }),
        (u.prototype.toBytes = function () {
          return this.Rencoded().concat(this.Sencoded());
        }),
        (u.prototype.toHex = function () {
          return i.encode(this.toBytes(), 'hex').toUpperCase();
        }),
        (e.exports = u);
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(92);
      t.Transaction = class {
        constructor(e, t, r, i) {
          (this.type = e),
            (this.ep = t),
            (this.data = r),
            (this.deferred = i),
            (this.gas_price = 0),
            (this.max_gas = 0),
            (this.max_fee = 0),
            (this.retries_left = n.MAX_RETRIES);
        }
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      t.Deferred = class {
        constructor() {
          (this.reject = void 0),
            (this.resolve = void 0),
            (this.promise = new Promise((e, t) => {
              (this.reject = t), (this.resolve = e);
            }));
        }
      };
    },
    function (e, t, r) {
      e.exports = r(179);
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(93),
        o = r(180),
        a = r(103);
      function s(e) {
        var t = new o(e),
          r = i(o.prototype.request, t);
        return n.extend(r, o.prototype, t), n.extend(r, t), r;
      }
      var u = s(r(95));
      (u.Axios = o),
        (u.create = function (e) {
          return s(a(u.defaults, e));
        }),
        (u.Cancel = r(104)),
        (u.CancelToken = r(197)),
        (u.isCancel = r(94)),
        (u.all = function (e) {
          return Promise.all(e);
        }),
        (u.spread = r(198)),
        (e.exports = u),
        (e.exports.default = u);
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(56),
        o = r(181),
        a = r(182),
        s = r(103);
      function u(e) {
        (this.defaults = e),
          (this.interceptors = { request: new o(), response: new o() });
      }
      (u.prototype.request = function (e) {
        'string' == typeof e
          ? ((e = arguments[1] || {}).url = arguments[0])
          : (e = e || {}),
          (e = s(this.defaults, e)).method
            ? (e.method = e.method.toLowerCase())
            : this.defaults.method
            ? (e.method = this.defaults.method.toLowerCase())
            : (e.method = 'get');
        var t = [a, void 0],
          r = Promise.resolve(e);
        for (
          this.interceptors.request.forEach(function (e) {
            t.unshift(e.fulfilled, e.rejected);
          }),
            this.interceptors.response.forEach(function (e) {
              t.push(e.fulfilled, e.rejected);
            });
          t.length;

        )
          r = r.then(t.shift(), t.shift());
        return r;
      }),
        (u.prototype.getUri = function (e) {
          return (
            (e = s(this.defaults, e)),
            i(e.url, e.params, e.paramsSerializer).replace(/^\?/, '')
          );
        }),
        n.forEach(['delete', 'get', 'head', 'options'], function (e) {
          u.prototype[e] = function (t, r) {
            return this.request(n.merge(r || {}, { method: e, url: t }));
          };
        }),
        n.forEach(['post', 'put', 'patch'], function (e) {
          u.prototype[e] = function (t, r, i) {
            return this.request(
              n.merge(i || {}, { method: e, url: t, data: r })
            );
          };
        }),
        (e.exports = u);
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      function i() {
        this.handlers = [];
      }
      (i.prototype.use = function (e, t) {
        return (
          this.handlers.push({ fulfilled: e, rejected: t }),
          this.handlers.length - 1
        );
      }),
        (i.prototype.eject = function (e) {
          this.handlers[e] && (this.handlers[e] = null);
        }),
        (i.prototype.forEach = function (e) {
          n.forEach(this.handlers, function (t) {
            null !== t && e(t);
          });
        }),
        (e.exports = i);
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(183),
        o = r(94),
        a = r(95);
      function s(e) {
        e.cancelToken && e.cancelToken.throwIfRequested();
      }
      e.exports = function (e) {
        return (
          s(e),
          (e.headers = e.headers || {}),
          (e.data = i(e.data, e.headers, e.transformRequest)),
          (e.headers = n.merge(
            e.headers.common || {},
            e.headers[e.method] || {},
            e.headers
          )),
          n.forEach(
            ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
            function (t) {
              delete e.headers[t];
            }
          ),
          (e.adapter || a.adapter)(e).then(
            function (t) {
              return (
                s(e), (t.data = i(t.data, t.headers, e.transformResponse)), t
              );
            },
            function (t) {
              return (
                o(t) ||
                  (s(e),
                  t &&
                    t.response &&
                    (t.response.data = i(
                      t.response.data,
                      t.response.headers,
                      e.transformResponse
                    ))),
                Promise.reject(t)
              );
            }
          )
        );
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      e.exports = function (e, t, r) {
        return (
          n.forEach(r, function (r) {
            e = r(e, t);
          }),
          e
        );
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      e.exports = function (e, t) {
        n.forEach(e, function (r, n) {
          n !== t &&
            n.toUpperCase() === t.toUpperCase() &&
            ((e[t] = r), delete e[n]);
        });
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(96),
        o = r(56),
        a = r(98),
        s = r(188),
        u = r(189),
        c = r(57);
      e.exports = function (e) {
        return new Promise(function (t, f) {
          var l = e.data,
            d = e.headers;
          n.isFormData(l) && delete d['Content-Type'];
          var h = new XMLHttpRequest();
          if (e.auth) {
            var p = e.auth.username || '',
              m = e.auth.password || '';
            d.Authorization = 'Basic ' + btoa(p + ':' + m);
          }
          var b = a(e.baseURL, e.url);
          if (
            (h.open(
              e.method.toUpperCase(),
              o(b, e.params, e.paramsSerializer),
              !0
            ),
            (h.timeout = e.timeout),
            (h.onreadystatechange = function () {
              if (
                h &&
                4 === h.readyState &&
                (0 !== h.status ||
                  (h.responseURL && 0 === h.responseURL.indexOf('file:')))
              ) {
                var r =
                    'getAllResponseHeaders' in h
                      ? s(h.getAllResponseHeaders())
                      : null,
                  n = {
                    data:
                      e.responseType && 'text' !== e.responseType
                        ? h.response
                        : h.responseText,
                    status: h.status,
                    statusText: h.statusText,
                    headers: r,
                    config: e,
                    request: h,
                  };
                i(t, f, n), (h = null);
              }
            }),
            (h.onabort = function () {
              h && (f(c('Request aborted', e, 'ECONNABORTED', h)), (h = null));
            }),
            (h.onerror = function () {
              f(c('Network Error', e, null, h)), (h = null);
            }),
            (h.ontimeout = function () {
              var t = 'timeout of ' + e.timeout + 'ms exceeded';
              e.timeoutErrorMessage && (t = e.timeoutErrorMessage),
                f(c(t, e, 'ECONNABORTED', h)),
                (h = null);
            }),
            n.isStandardBrowserEnv())
          ) {
            var g = r(190),
              v =
                (e.withCredentials || u(b)) && e.xsrfCookieName
                  ? g.read(e.xsrfCookieName)
                  : void 0;
            v && (d[e.xsrfHeaderName] = v);
          }
          if (
            ('setRequestHeader' in h &&
              n.forEach(d, function (e, t) {
                void 0 === l && 'content-type' === t.toLowerCase()
                  ? delete d[t]
                  : h.setRequestHeader(t, e);
              }),
            n.isUndefined(e.withCredentials) ||
              (h.withCredentials = !!e.withCredentials),
            e.responseType)
          )
            try {
              h.responseType = e.responseType;
            } catch (t) {
              if ('json' !== e.responseType) throw t;
            }
          'function' == typeof e.onDownloadProgress &&
            h.addEventListener('progress', e.onDownloadProgress),
            'function' == typeof e.onUploadProgress &&
              h.upload &&
              h.upload.addEventListener('progress', e.onUploadProgress),
            e.cancelToken &&
              e.cancelToken.promise.then(function (e) {
                h && (h.abort(), f(e), (h = null));
              }),
            void 0 === l && (l = null),
            h.send(l);
        });
      };
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e);
      };
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e, t) {
        return t ? e.replace(/\/+$/, '') + '/' + t.replace(/^\/+/, '') : e;
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = [
          'age',
          'authorization',
          'content-length',
          'content-type',
          'etag',
          'expires',
          'from',
          'host',
          'if-modified-since',
          'if-unmodified-since',
          'last-modified',
          'location',
          'max-forwards',
          'proxy-authorization',
          'referer',
          'retry-after',
          'user-agent',
        ];
      e.exports = function (e) {
        var t,
          r,
          o,
          a = {};
        return e
          ? (n.forEach(e.split('\n'), function (e) {
              if (
                ((o = e.indexOf(':')),
                (t = n.trim(e.substr(0, o)).toLowerCase()),
                (r = n.trim(e.substr(o + 1))),
                t)
              ) {
                if (a[t] && i.indexOf(t) >= 0) return;
                a[t] =
                  'set-cookie' === t
                    ? (a[t] ? a[t] : []).concat([r])
                    : a[t]
                    ? a[t] + ', ' + r
                    : r;
              }
            }),
            a)
          : a;
      };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      e.exports = n.isStandardBrowserEnv()
        ? (function () {
            var e,
              t = /(msie|trident)/i.test(navigator.userAgent),
              r = document.createElement('a');
            function i(e) {
              var n = e;
              return (
                t && (r.setAttribute('href', n), (n = r.href)),
                r.setAttribute('href', n),
                {
                  href: r.href,
                  protocol: r.protocol ? r.protocol.replace(/:$/, '') : '',
                  host: r.host,
                  search: r.search ? r.search.replace(/^\?/, '') : '',
                  hash: r.hash ? r.hash.replace(/^#/, '') : '',
                  hostname: r.hostname,
                  port: r.port,
                  pathname:
                    '/' === r.pathname.charAt(0)
                      ? r.pathname
                      : '/' + r.pathname,
                }
              );
            }
            return (
              (e = i(window.location.href)),
              function (t) {
                var r = n.isString(t) ? i(t) : t;
                return r.protocol === e.protocol && r.host === e.host;
              }
            );
          })()
        : function () {
            return !0;
          };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6);
      e.exports = n.isStandardBrowserEnv()
        ? {
            write: function (e, t, r, i, o, a) {
              var s = [];
              s.push(e + '=' + encodeURIComponent(t)),
                n.isNumber(r) && s.push('expires=' + new Date(r).toGMTString()),
                n.isString(i) && s.push('path=' + i),
                n.isString(o) && s.push('domain=' + o),
                !0 === a && s.push('secure'),
                (document.cookie = s.join('; '));
            },
            read: function (e) {
              var t = document.cookie.match(
                new RegExp('(^|;\\s*)(' + e + ')=([^;]*)')
              );
              return t ? decodeURIComponent(t[3]) : null;
            },
            remove: function (e) {
              this.write(e, '', Date.now() - 864e5);
            },
          }
        : {
            write: function () {},
            read: function () {
              return null;
            },
            remove: function () {},
          };
    },
    function (e, t, r) {
      'use strict';
      var n = r(6),
        i = r(96),
        o = r(98),
        a = r(56),
        s = r(26),
        u = r(29),
        c = r(99).http,
        f = r(99).https,
        l = r(17),
        d = r(77),
        h = r(196),
        p = r(57),
        m = r(97),
        b = /https:?/;
      e.exports = function (e) {
        return new Promise(function (t, r) {
          var g = function (e) {
              t(e);
            },
            v = function (e) {
              r(e);
            },
            y = e.data,
            w = e.headers;
          if (
            (w['User-Agent'] ||
              w['user-agent'] ||
              (w['User-Agent'] = 'axios/' + h.version),
            y && !n.isStream(y))
          ) {
            if (Buffer.isBuffer(y));
            else if (n.isArrayBuffer(y)) y = Buffer.from(new Uint8Array(y));
            else {
              if (!n.isString(y))
                return v(
                  p(
                    'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
                    e
                  )
                );
              y = Buffer.from(y, 'utf-8');
            }
            w['Content-Length'] = y.length;
          }
          var _ = void 0;
          e.auth &&
            (_ = (e.auth.username || '') + ':' + (e.auth.password || ''));
          var S = o(e.baseURL, e.url),
            M = l.parse(S),
            E = M.protocol || 'http:';
          if (!_ && M.auth) {
            var k = M.auth.split(':');
            _ = (k[0] || '') + ':' + (k[1] || '');
          }
          _ && delete w.Authorization;
          var x = b.test(E),
            T = x ? e.httpsAgent : e.httpAgent,
            O = {
              path: a(M.path, e.params, e.paramsSerializer).replace(/^\?/, ''),
              method: e.method.toUpperCase(),
              headers: w,
              agent: T,
              agents: { http: e.httpAgent, https: e.httpsAgent },
              auth: _,
            };
          e.socketPath
            ? (O.socketPath = e.socketPath)
            : ((O.hostname = M.hostname), (O.port = M.port));
          var I,
            A = e.proxy;
          if (!A && !1 !== A) {
            var P = E.slice(0, -1) + '_proxy',
              N = process.env[P] || process.env[P.toUpperCase()];
            if (N) {
              var B = l.parse(N),
                C = process.env.no_proxy || process.env.NO_PROXY,
                R = !0;
              if (C)
                R = !C.split(',')
                  .map(function (e) {
                    return e.trim();
                  })
                  .some(function (e) {
                    return (
                      !!e &&
                      ('*' === e ||
                        ('.' === e[0] &&
                          M.hostname.substr(M.hostname.length - e.length) ===
                            e) ||
                        M.hostname === e)
                    );
                  });
              if (R && ((A = { host: B.hostname, port: B.port }), B.auth)) {
                var j = B.auth.split(':');
                A.auth = { username: j[0], password: j[1] };
              }
            }
          }
          if (
            A &&
            ((O.hostname = A.host),
            (O.host = A.host),
            (O.headers.host = M.hostname + (M.port ? ':' + M.port : '')),
            (O.port = A.port),
            (O.path =
              E + '//' + M.hostname + (M.port ? ':' + M.port : '') + O.path),
            A.auth)
          ) {
            var z = Buffer.from(
              A.auth.username + ':' + A.auth.password,
              'utf8'
            ).toString('base64');
            O.headers['Proxy-Authorization'] = 'Basic ' + z;
          }
          var q = x && (!A || b.test(A.protocol));
          e.transport
            ? (I = e.transport)
            : 0 === e.maxRedirects
            ? (I = q ? u : s)
            : (e.maxRedirects && (O.maxRedirects = e.maxRedirects),
              (I = q ? f : c)),
            e.maxContentLength &&
              e.maxContentLength > -1 &&
              (O.maxBodyLength = e.maxContentLength);
          var U = I.request(O, function (t) {
            if (!U.aborted) {
              var r = t;
              switch (t.headers['content-encoding']) {
                case 'gzip':
                case 'compress':
                case 'deflate':
                  (r = 204 === t.statusCode ? r : r.pipe(d.createUnzip())),
                    delete t.headers['content-encoding'];
              }
              var n = t.req || U,
                o = {
                  status: t.statusCode,
                  statusText: t.statusMessage,
                  headers: t.headers,
                  config: e,
                  request: n,
                };
              if ('stream' === e.responseType) (o.data = r), i(g, v, o);
              else {
                var a = [];
                r.on('data', function (t) {
                  a.push(t),
                    e.maxContentLength > -1 &&
                      Buffer.concat(a).length > e.maxContentLength &&
                      (r.destroy(),
                      v(
                        p(
                          'maxContentLength size of ' +
                            e.maxContentLength +
                            ' exceeded',
                          e,
                          null,
                          n
                        )
                      ));
                }),
                  r.on('error', function (t) {
                    U.aborted || v(m(t, e, null, n));
                  }),
                  r.on('end', function () {
                    var t = Buffer.concat(a);
                    'arraybuffer' !== e.responseType &&
                      (t = t.toString(e.responseEncoding)),
                      (o.data = t),
                      i(g, v, o);
                  });
              }
            }
          });
          U.on('error', function (t) {
            U.aborted || v(m(t, e, null, U));
          }),
            e.timeout &&
              U.setTimeout(e.timeout, function () {
                U.abort(),
                  v(
                    p(
                      'timeout of ' + e.timeout + 'ms exceeded',
                      e,
                      'ECONNABORTED',
                      U
                    )
                  );
              }),
            e.cancelToken &&
              e.cancelToken.promise.then(function (e) {
                U.aborted || (U.abort(), v(e));
              }),
            n.isStream(y)
              ? y
                  .on('error', function (t) {
                    v(m(t, e, null, U));
                  })
                  .pipe(U)
              : U.end(y);
        });
      };
    },
    function (e, t, r) {
      'undefined' == typeof process || 'renderer' === process.type
        ? (e.exports = r(193))
        : (e.exports = r(195));
    },
    function (e, t, r) {
      function n() {
        var e;
        try {
          e = t.storage.debug;
        } catch (e) {}
        return (
          !e &&
            'undefined' != typeof process &&
            'env' in process &&
            (e = process.env.DEBUG),
          e
        );
      }
      ((t = e.exports = r(100)).log = function () {
        return (
          'object' == typeof console &&
          console.log &&
          Function.prototype.apply.call(console.log, console, arguments)
        );
      }),
        (t.formatArgs = function (e) {
          var r = this.useColors;
          if (
            ((e[0] =
              (r ? '%c' : '') +
              this.namespace +
              (r ? ' %c' : ' ') +
              e[0] +
              (r ? '%c ' : ' ') +
              '+' +
              t.humanize(this.diff)),
            !r)
          )
            return;
          var n = 'color: ' + this.color;
          e.splice(1, 0, n, 'color: inherit');
          var i = 0,
            o = 0;
          e[0].replace(/%[a-zA-Z%]/g, function (e) {
            '%%' !== e && (i++, '%c' === e && (o = i));
          }),
            e.splice(o, 0, n);
        }),
        (t.save = function (e) {
          try {
            null == e ? t.storage.removeItem('debug') : (t.storage.debug = e);
          } catch (e) {}
        }),
        (t.load = n),
        (t.useColors = function () {
          if (
            'undefined' != typeof window &&
            window.process &&
            'renderer' === window.process.type
          )
            return !0;
          if (
            'undefined' != typeof navigator &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
          )
            return !1;
          return (
            ('undefined' != typeof document &&
              document.documentElement &&
              document.documentElement.style &&
              document.documentElement.style.WebkitAppearance) ||
            ('undefined' != typeof window &&
              window.console &&
              (window.console.firebug ||
                (window.console.exception && window.console.table))) ||
            ('undefined' != typeof navigator &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
              parseInt(RegExp.$1, 10) >= 31) ||
            ('undefined' != typeof navigator &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
          );
        }),
        (t.storage =
          'undefined' != typeof chrome && void 0 !== chrome.storage
            ? chrome.storage.local
            : (function () {
                try {
                  return window.localStorage;
                } catch (e) {}
              })()),
        (t.colors = [
          '#0000CC',
          '#0000FF',
          '#0033CC',
          '#0033FF',
          '#0066CC',
          '#0066FF',
          '#0099CC',
          '#0099FF',
          '#00CC00',
          '#00CC33',
          '#00CC66',
          '#00CC99',
          '#00CCCC',
          '#00CCFF',
          '#3300CC',
          '#3300FF',
          '#3333CC',
          '#3333FF',
          '#3366CC',
          '#3366FF',
          '#3399CC',
          '#3399FF',
          '#33CC00',
          '#33CC33',
          '#33CC66',
          '#33CC99',
          '#33CCCC',
          '#33CCFF',
          '#6600CC',
          '#6600FF',
          '#6633CC',
          '#6633FF',
          '#66CC00',
          '#66CC33',
          '#9900CC',
          '#9900FF',
          '#9933CC',
          '#9933FF',
          '#99CC00',
          '#99CC33',
          '#CC0000',
          '#CC0033',
          '#CC0066',
          '#CC0099',
          '#CC00CC',
          '#CC00FF',
          '#CC3300',
          '#CC3333',
          '#CC3366',
          '#CC3399',
          '#CC33CC',
          '#CC33FF',
          '#CC6600',
          '#CC6633',
          '#CC9900',
          '#CC9933',
          '#CCCC00',
          '#CCCC33',
          '#FF0000',
          '#FF0033',
          '#FF0066',
          '#FF0099',
          '#FF00CC',
          '#FF00FF',
          '#FF3300',
          '#FF3333',
          '#FF3366',
          '#FF3399',
          '#FF33CC',
          '#FF33FF',
          '#FF6600',
          '#FF6633',
          '#FF9900',
          '#FF9933',
          '#FFCC00',
          '#FFCC33',
        ]),
        (t.formatters.j = function (e) {
          try {
            return JSON.stringify(e);
          } catch (e) {
            return '[UnexpectedJSONParseError]: ' + e.message;
          }
        }),
        t.enable(n());
    },
    function (e, t) {
      var r = 1e3,
        n = 6e4,
        i = 60 * n,
        o = 24 * i;
      function a(e, t, r) {
        if (!(e < t))
          return e < 1.5 * t
            ? Math.floor(e / t) + ' ' + r
            : Math.ceil(e / t) + ' ' + r + 's';
      }
      e.exports = function (e, t) {
        t = t || {};
        var s,
          u = typeof e;
        if ('string' === u && e.length > 0)
          return (function (e) {
            if ((e = String(e)).length > 100) return;
            var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
              e
            );
            if (!t) return;
            var a = parseFloat(t[1]);
            switch ((t[2] || 'ms').toLowerCase()) {
              case 'years':
              case 'year':
              case 'yrs':
              case 'yr':
              case 'y':
                return 315576e5 * a;
              case 'days':
              case 'day':
              case 'd':
                return a * o;
              case 'hours':
              case 'hour':
              case 'hrs':
              case 'hr':
              case 'h':
                return a * i;
              case 'minutes':
              case 'minute':
              case 'mins':
              case 'min':
              case 'm':
                return a * n;
              case 'seconds':
              case 'second':
              case 'secs':
              case 'sec':
              case 's':
                return a * r;
              case 'milliseconds':
              case 'millisecond':
              case 'msecs':
              case 'msec':
              case 'ms':
                return a;
              default:
                return;
            }
          })(e);
        if ('number' === u && !1 === isNaN(e))
          return t.long
            ? a((s = e), o, 'day') ||
                a(s, i, 'hour') ||
                a(s, n, 'minute') ||
                a(s, r, 'second') ||
                s + ' ms'
            : (function (e) {
                if (e >= o) return Math.round(e / o) + 'd';
                if (e >= i) return Math.round(e / i) + 'h';
                if (e >= n) return Math.round(e / n) + 'm';
                if (e >= r) return Math.round(e / r) + 's';
                return e + 'ms';
              })(e);
        throw new Error(
          'val is not a non-empty string or a valid number. val=' +
            JSON.stringify(e)
        );
      };
    },
    function (e, t, r) {
      var n = r(101),
        i = r(1);
      ((t = e.exports = r(100)).init = function (e) {
        e.inspectOpts = {};
        for (var r = Object.keys(t.inspectOpts), n = 0; n < r.length; n++)
          e.inspectOpts[r[n]] = t.inspectOpts[r[n]];
      }),
        (t.log = function () {
          return process.stderr.write(i.format.apply(i, arguments) + '\n');
        }),
        (t.formatArgs = function (e) {
          var r = this.namespace;
          if (this.useColors) {
            var n = this.color,
              i = '[3' + (n < 8 ? n : '8;5;' + n),
              o = '  ' + i + ';1m' + r + ' [0m';
            (e[0] = o + e[0].split('\n').join('\n' + o)),
              e.push(i + 'm+' + t.humanize(this.diff) + '[0m');
          } else
            e[0] =
              (t.inspectOpts.hideDate ? '' : new Date().toISOString() + ' ') +
              r +
              ' ' +
              e[0];
        }),
        (t.save = function (e) {
          null == e ? delete process.env.DEBUG : (process.env.DEBUG = e);
        }),
        (t.load = a),
        (t.useColors = function () {
          return 'colors' in t.inspectOpts
            ? Boolean(t.inspectOpts.colors)
            : n.isatty(process.stderr.fd);
        }),
        (t.colors = [6, 2, 3, 4, 5, 1]);
      try {
        var o = r(102);
        o &&
          o.level >= 2 &&
          (t.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221,
          ]);
      } catch (e) {}
      function a() {
        return process.env.DEBUG;
      }
      (t.inspectOpts = Object.keys(process.env)
        .filter(function (e) {
          return /^debug_/i.test(e);
        })
        .reduce(function (e, t) {
          var r = t
              .substring(6)
              .toLowerCase()
              .replace(/_([a-z])/g, function (e, t) {
                return t.toUpperCase();
              }),
            n = process.env[t];
          return (
            (n =
              !!/^(yes|on|true|enabled)$/i.test(n) ||
              (!/^(no|off|false|disabled)$/i.test(n) &&
                ('null' === n ? null : Number(n)))),
            (e[r] = n),
            e
          );
        }, {})),
        (t.formatters.o = function (e) {
          return (
            (this.inspectOpts.colors = this.useColors),
            i
              .inspect(e, this.inspectOpts)
              .split('\n')
              .map(function (e) {
                return e.trim();
              })
              .join(' ')
          );
        }),
        (t.formatters.O = function (e) {
          return (
            (this.inspectOpts.colors = this.useColors),
            i.inspect(e, this.inspectOpts)
          );
        }),
        t.enable(a());
    },
    function (e) {
      e.exports = JSON.parse(
        '{"name":"axios","version":"0.19.2","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test && bundlesize","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://github.com/axios/axios","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"typings":"./index.d.ts","dependencies":{"follow-redirects":"1.5.10"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}'
      );
    },
    function (e, t, r) {
      'use strict';
      var n = r(104);
      function i(e) {
        if ('function' != typeof e)
          throw new TypeError('executor must be a function.');
        var t;
        this.promise = new Promise(function (e) {
          t = e;
        });
        var r = this;
        e(function (e) {
          r.reason || ((r.reason = new n(e)), t(r.reason));
        });
      }
      (i.prototype.throwIfRequested = function () {
        if (this.reason) throw this.reason;
      }),
        (i.source = function () {
          var e;
          return {
            token: new i(function (t) {
              e = t;
            }),
            cancel: e,
          };
        }),
        (e.exports = i);
    },
    function (e, t, r) {
      'use strict';
      e.exports = function (e) {
        return function (t) {
          return e.apply(null, t);
        };
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(105);
      t.bip32 = n;
      const i = r(60);
      t.address = i;
      const o = r(19);
      t.crypto = o;
      const a = r(62);
      t.ECPair = a;
      const s = r(8);
      t.networks = s;
      const u = r(47);
      t.payments = u;
      const c = r(0);
      t.script = c;
      var f = r(222);
      t.Block = f.Block;
      var l = r(224);
      t.Psbt = l.Psbt;
      var d = r(0);
      t.opcodes = d.OPS;
      var h = r(48);
      t.Transaction = h.Transaction;
      var p = r(242);
      t.TransactionBuilder = p.TransactionBuilder;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(201),
        i = r(37),
        o = r(27),
        a = r(4),
        s = r(107),
        u = a.BufferN(32),
        c = a.compile({
          wif: a.UInt8,
          bip32: { public: a.UInt32, private: a.UInt32 },
        }),
        f = {
          messagePrefix: 'Bitcoin Signed Message:\n',
          bech32: 'bc',
          bip32: { public: 76067358, private: 76066276 },
          pubKeyHash: 0,
          scriptHash: 5,
          wif: 128,
        },
        l = Math.pow(2, 31) - 1;
      function d(e) {
        return a.String(e) && null !== e.match(/^(m\/)?(\d+'?\/)*\d+'?$/);
      }
      function h(e) {
        return a.UInt32(e) && e <= l;
      }
      class p {
        constructor(e, t, r, n, i = 0, o = 0, s = 0) {
          (this.__D = e),
            (this.__Q = t),
            (this.chainCode = r),
            (this.network = n),
            (this.__DEPTH = i),
            (this.__INDEX = o),
            (this.__PARENT_FINGERPRINT = s),
            a(c, n),
            (this.lowR = !1);
        }
        get depth() {
          return this.__DEPTH;
        }
        get index() {
          return this.__INDEX;
        }
        get parentFingerprint() {
          return this.__PARENT_FINGERPRINT;
        }
        get publicKey() {
          return (
            void 0 === this.__Q && (this.__Q = o.pointFromScalar(this.__D, !0)),
            this.__Q
          );
        }
        get privateKey() {
          return this.__D;
        }
        get identifier() {
          return n.hash160(this.publicKey);
        }
        get fingerprint() {
          return this.identifier.slice(0, 4);
        }
        isNeutered() {
          return void 0 === this.__D;
        }
        neutered() {
          return g(
            this.publicKey,
            this.chainCode,
            this.network,
            this.depth,
            this.index,
            this.parentFingerprint
          );
        }
        toBase58() {
          const e = this.network,
            t = this.isNeutered() ? e.bip32.public : e.bip32.private,
            r = Buffer.allocUnsafe(78);
          return (
            r.writeUInt32BE(t, 0),
            r.writeUInt8(this.depth, 4),
            r.writeUInt32BE(this.parentFingerprint, 5),
            r.writeUInt32BE(this.index, 9),
            this.chainCode.copy(r, 13),
            this.isNeutered()
              ? this.publicKey.copy(r, 45)
              : (r.writeUInt8(0, 45), this.privateKey.copy(r, 46)),
            i.encode(r)
          );
        }
        toWIF() {
          if (!this.privateKey) throw new TypeError('Missing private key');
          return s.encode(this.network.wif, this.privateKey, !0);
        }
        derive(e) {
          a(a.UInt32, e);
          const t = e >= 2147483648,
            r = Buffer.allocUnsafe(37);
          if (t) {
            if (this.isNeutered())
              throw new TypeError('Missing private key for hardened child key');
            (r[0] = 0), this.privateKey.copy(r, 1), r.writeUInt32BE(e, 33);
          } else this.publicKey.copy(r, 0), r.writeUInt32BE(e, 33);
          const i = n.hmacSHA512(this.chainCode, r),
            s = i.slice(0, 32),
            u = i.slice(32);
          if (!o.isPrivate(s)) return this.derive(e + 1);
          let c;
          if (this.isNeutered()) {
            const t = o.pointAddScalar(this.publicKey, s, !0);
            if (null === t) return this.derive(e + 1);
            c = g(
              t,
              u,
              this.network,
              this.depth + 1,
              e,
              this.fingerprint.readUInt32BE(0)
            );
          } else {
            const t = o.privateAdd(this.privateKey, s);
            if (null == t) return this.derive(e + 1);
            c = b(
              t,
              u,
              this.network,
              this.depth + 1,
              e,
              this.fingerprint.readUInt32BE(0)
            );
          }
          return c;
        }
        deriveHardened(e) {
          return a(h, e), this.derive(e + 2147483648);
        }
        derivePath(e) {
          a(d, e);
          let t = e.split('/');
          if ('m' === t[0]) {
            if (this.parentFingerprint)
              throw new TypeError('Expected master, got child');
            t = t.slice(1);
          }
          return t.reduce((e, t) => {
            let r;
            return "'" === t.slice(-1)
              ? ((r = parseInt(t.slice(0, -1), 10)), e.deriveHardened(r))
              : ((r = parseInt(t, 10)), e.derive(r));
          }, this);
        }
        sign(e, t) {
          if (!this.privateKey) throw new Error('Missing private key');
          if ((void 0 === t && (t = this.lowR), !1 === t))
            return o.sign(e, this.privateKey);
          {
            let t = o.sign(e, this.privateKey);
            const r = Buffer.alloc(32, 0);
            let n = 0;
            for (; t[0] > 127; )
              n++,
                r.writeUIntLE(n, 0, 6),
                (t = o.signWithEntropy(e, this.privateKey, r));
            return t;
          }
        }
        verify(e, t) {
          return o.verify(e, this.publicKey, t);
        }
      }
      function m(e, t, r) {
        return b(e, t, r);
      }
      function b(e, t, r, n, i, s) {
        if (
          (a({ privateKey: u, chainCode: u }, { privateKey: e, chainCode: t }),
          (r = r || f),
          !o.isPrivate(e))
        )
          throw new TypeError('Private key not in range [1, n)');
        return new p(e, void 0, t, r, n, i, s);
      }
      function g(e, t, r, n, i, s) {
        if (
          (a(
            { publicKey: a.BufferN(33), chainCode: u },
            { publicKey: e, chainCode: t }
          ),
          (r = r || f),
          !o.isPoint(e))
        )
          throw new TypeError('Point is not on the curve');
        return new p(void 0, e, t, r, n, i, s);
      }
      (t.fromBase58 = function (e, t) {
        const r = i.decode(e);
        if (78 !== r.length) throw new TypeError('Invalid buffer length');
        t = t || f;
        const n = r.readUInt32BE(0);
        if (n !== t.bip32.private && n !== t.bip32.public)
          throw new TypeError('Invalid network version');
        const o = r[4],
          a = r.readUInt32BE(5);
        if (0 === o && 0 !== a)
          throw new TypeError('Invalid parent fingerprint');
        const s = r.readUInt32BE(9);
        if (0 === o && 0 !== s) throw new TypeError('Invalid index');
        const u = r.slice(13, 45);
        let c;
        if (n === t.bip32.private) {
          if (0 !== r.readUInt8(45)) throw new TypeError('Invalid private key');
          c = b(r.slice(46, 78), u, t, o, s, a);
        } else {
          c = g(r.slice(45, 78), u, t, o, s, a);
        }
        return c;
      }),
        (t.fromPrivateKey = m),
        (t.fromPublicKey = function (e, t, r) {
          return g(e, t, r);
        }),
        (t.fromSeed = function (e, t) {
          if ((a(a.Buffer, e), e.length < 16))
            throw new TypeError('Seed should be at least 128 bits');
          if (e.length > 64)
            throw new TypeError('Seed should be at most 512 bits');
          t = t || f;
          const r = n.hmacSHA512(Buffer.from('Bitcoin seed', 'utf8'), e);
          return m(r.slice(0, 32), r.slice(32), t);
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(46),
        i = r(58);
      (t.hash160 = function (e) {
        const t = n('sha256').update(e).digest();
        try {
          return n('rmd160').update(t).digest();
        } catch (e) {
          return n('ripemd160').update(t).digest();
        }
      }),
        (t.hmacSHA512 = function (e, t) {
          return i('sha512', e).update(t).digest();
        });
    },
    function (e, t, r) {
      'use strict';
      var n = r(203),
        i = r(16).Buffer;
      e.exports = function (e) {
        function t(t) {
          var r = t.slice(0, -4),
            n = t.slice(-4),
            i = e(r);
          if (!((n[0] ^ i[0]) | (n[1] ^ i[1]) | (n[2] ^ i[2]) | (n[3] ^ i[3])))
            return r;
        }
        return {
          encode: function (t) {
            var r = e(t);
            return n.encode(i.concat([t, r], t.length + 4));
          },
          decode: function (e) {
            var r = t(n.decode(e));
            if (!r) throw new Error('Invalid checksum');
            return r;
          },
          decodeUnsafe: function (e) {
            var r = n.decodeUnsafe(e);
            if (r) return t(r);
          },
        };
      };
    },
    function (e, t, r) {
      var n = r(204);
      e.exports = n(
        '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      );
    },
    function (e, t, r) {
      'use strict';
      var n = r(16).Buffer;
      e.exports = function (e) {
        if (e.length >= 255) throw new TypeError('Alphabet too long');
        for (var t = new Uint8Array(256), r = 0; r < t.length; r++) t[r] = 255;
        for (var i = 0; i < e.length; i++) {
          var o = e.charAt(i),
            a = o.charCodeAt(0);
          if (255 !== t[a]) throw new TypeError(o + ' is ambiguous');
          t[a] = i;
        }
        var s = e.length,
          u = e.charAt(0),
          c = Math.log(s) / Math.log(256),
          f = Math.log(256) / Math.log(s);
        function l(e) {
          if ('string' != typeof e) throw new TypeError('Expected String');
          if (0 === e.length) return n.alloc(0);
          var r = 0;
          if (' ' !== e[r]) {
            for (var i = 0, o = 0; e[r] === u; ) i++, r++;
            for (
              var a = ((e.length - r) * c + 1) >>> 0, f = new Uint8Array(a);
              e[r];

            ) {
              var l = t[e.charCodeAt(r)];
              if (255 === l) return;
              for (
                var d = 0, h = a - 1;
                (0 !== l || d < o) && -1 !== h;
                h--, d++
              )
                (l += (s * f[h]) >>> 0),
                  (f[h] = l % 256 >>> 0),
                  (l = (l / 256) >>> 0);
              if (0 !== l) throw new Error('Non-zero carry');
              (o = d), r++;
            }
            if (' ' !== e[r]) {
              for (var p = a - o; p !== a && 0 === f[p]; ) p++;
              var m = n.allocUnsafe(i + (a - p));
              m.fill(0, 0, i);
              for (var b = i; p !== a; ) m[b++] = f[p++];
              return m;
            }
          }
        }
        return {
          encode: function (t) {
            if (
              ((Array.isArray(t) || t instanceof Uint8Array) && (t = n.from(t)),
              !n.isBuffer(t))
            )
              throw new TypeError('Expected Buffer');
            if (0 === t.length) return '';
            for (var r = 0, i = 0, o = 0, a = t.length; o !== a && 0 === t[o]; )
              o++, r++;
            for (
              var c = ((a - o) * f + 1) >>> 0, l = new Uint8Array(c);
              o !== a;

            ) {
              for (
                var d = t[o], h = 0, p = c - 1;
                (0 !== d || h < i) && -1 !== p;
                p--, h++
              )
                (d += (256 * l[p]) >>> 0),
                  (l[p] = d % s >>> 0),
                  (d = (d / s) >>> 0);
              if (0 !== d) throw new Error('Non-zero carry');
              (i = h), o++;
            }
            for (var m = c - i; m !== c && 0 === l[m]; ) m++;
            for (var b = u.repeat(r); m < c; ++m) b += e.charAt(l[m]);
            return b;
          },
          decodeUnsafe: l,
          decode: function (e) {
            var t = l(e);
            if (t) return t;
            throw new Error('Non-base' + s + ' character');
          },
        };
      };
    },
    function (e, t, r) {
      'use strict';
      let n = r(206)('secp256k1');
      delete n.path;
      for (let e in n)
        0 === e.indexOf('is') &&
          (n[e].toJSON = function () {
            return e;
          });
      e.exports = n;
    },
    function (e, t, r) {
      (function (n) {
        var i = r(41),
          o = r(35),
          a = r(207),
          s = o.join,
          u = o.dirname,
          c =
            (i.accessSync &&
              function (e) {
                try {
                  i.accessSync(e);
                } catch (e) {
                  return !1;
                }
                return !0;
              }) ||
            i.existsSync ||
            o.existsSync,
          f = {
            arrow: process.env.NODE_BINDINGS_ARROW || ' → ',
            compiled: process.env.NODE_BINDINGS_COMPILED_DIR || 'compiled',
            platform: process.platform,
            arch: process.arch,
            nodePreGyp:
              'node-v' +
              process.versions.modules +
              '-' +
              process.platform +
              '-' +
              process.arch,
            version: process.versions.node,
            bindings: 'bindings.node',
            try: [
              ['module_root', 'build', 'bindings'],
              ['module_root', 'build', 'Debug', 'bindings'],
              ['module_root', 'build', 'Release', 'bindings'],
              ['module_root', 'out', 'Debug', 'bindings'],
              ['module_root', 'Debug', 'bindings'],
              ['module_root', 'out', 'Release', 'bindings'],
              ['module_root', 'Release', 'bindings'],
              ['module_root', 'build', 'default', 'bindings'],
              [
                'module_root',
                'compiled',
                'version',
                'platform',
                'arch',
                'bindings',
              ],
              [
                'module_root',
                'addon-build',
                'release',
                'install-root',
                'bindings',
              ],
              [
                'module_root',
                'addon-build',
                'debug',
                'install-root',
                'bindings',
              ],
              [
                'module_root',
                'addon-build',
                'default',
                'install-root',
                'bindings',
              ],
              ['module_root', 'lib', 'binding', 'nodePreGyp', 'bindings'],
            ],
          };
        (e.exports = t = function (e) {
          'string' == typeof e ? (e = { bindings: e }) : e || (e = {}),
            Object.keys(f).map(function (t) {
              t in e || (e[t] = f[t]);
            }),
            e.module_root || (e.module_root = t.getRoot(t.getFileName())),
            '.node' != o.extname(e.bindings) && (e.bindings += '.node');
          for (
            var r, n, i, a = require, u = [], c = 0, l = e.try.length;
            c < l;
            c++
          ) {
            (r = s.apply(
              null,
              e.try[c].map(function (t) {
                return e[t] || t;
              })
            )),
              u.push(r);
            try {
              return (
                (n = e.path ? a.resolve(r) : a(r)), e.path || (n.path = r), n
              );
            } catch (e) {
              if (
                'MODULE_NOT_FOUND' !== e.code &&
                'QUALIFIED_PATH_RESOLUTION_FAILED' !== e.code &&
                !/not find/i.test(e.message)
              )
                throw e;
            }
          }
          throw (
            (((i = new Error(
              'Could not locate the bindings file. Tried:\n' +
                u
                  .map(function (t) {
                    return e.arrow + t;
                  })
                  .join('\n')
            )).tries = u),
            i)
          );
        }),
          (t.getFileName = function (e) {
            var t,
              r = Error.prepareStackTrace,
              i = Error.stackTraceLimit,
              o = {};
            (Error.stackTraceLimit = 10),
              (Error.prepareStackTrace = function (r, i) {
                for (var o = 0, a = i.length; o < a; o++)
                  if ((t = i[o].getFileName()) !== n) {
                    if (!e) return;
                    if (t !== e) return;
                  }
              }),
              Error.captureStackTrace(o),
              (Error.prepareStackTrace = r),
              (Error.stackTraceLimit = i);
            return 0 === t.indexOf('file://') && (t = a(t)), t;
          }),
          (t.getRoot = function (e) {
            for (var t, r = u(e); ; ) {
              if (
                ('.' === r && (r = process.cwd()),
                c(s(r, 'package.json')) || c(s(r, 'node_modules')))
              )
                return r;
              if (t === r)
                throw new Error(
                  'Could not find module root given file: "' +
                    e +
                    '". Do you have a `package.json` file? '
                );
              (t = r), (r = s(r, '..'));
            }
          });
      }.call(this, '/index.js'));
    },
    function (e, t, r) {
      var n = r(35).sep || '/';
      e.exports = function (e) {
        if (
          'string' != typeof e ||
          e.length <= 7 ||
          'file://' != e.substring(0, 7)
        )
          throw new TypeError(
            'must pass in a file:// URI to convert to a file path'
          );
        var t = decodeURI(e.substring(7)),
          r = t.indexOf('/'),
          i = t.substring(0, r),
          o = t.substring(r + 1);
        'localhost' == i && (i = '');
        i && (i = n + n + i);
        (o = o.replace(/^(.+)\|/, '$1:')),
          '\\' == n && (o = o.replace(/\//g, '\\'));
        /^.+\:/.test(o) || (o = n + o);
        return i + o;
      };
    },
    function (e, t, r) {
      const n = r(14),
        i = new (0, r(53).ec)('secp256k1'),
        o = r(209),
        a = Buffer.alloc(32, 0),
        s = Buffer.from(
          'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
          'hex'
        ),
        u = Buffer.from(
          'fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f',
          'hex'
        ),
        c = i.curve.n,
        f = c.shrn(1),
        l = i.curve.g;
      function d(e) {
        return Buffer.isBuffer(e) && 32 === e.length;
      }
      function h(e) {
        return !!d(e) && e.compare(s) < 0;
      }
      function p(e) {
        if (!Buffer.isBuffer(e)) return !1;
        if (e.length < 33) return !1;
        const t = e[0],
          r = e.slice(1, 33);
        if (0 === r.compare(a)) return !1;
        if (r.compare(u) >= 0) return !1;
        if ((2 === t || 3 === t) && 33 === e.length) {
          try {
            w(e);
          } catch (e) {
            return !1;
          }
          return !0;
        }
        const n = e.slice(33);
        return (
          0 !== n.compare(a) &&
          !(n.compare(u) >= 0) &&
          4 === t &&
          65 === e.length
        );
      }
      function m(e) {
        return 4 !== e[0];
      }
      function b(e) {
        return !!d(e) && e.compare(a) > 0 && e.compare(s) < 0;
      }
      function g(e, t) {
        return void 0 === e && void 0 !== t ? m(t) : void 0 === e || e;
      }
      function v(e) {
        return new n(e);
      }
      function y(e) {
        return e.toArrayLike(Buffer, 'be', 32);
      }
      function w(e) {
        return i.curve.decodePoint(e);
      }
      function _(e, t) {
        return Buffer.from(e._encode(t));
      }
      function S(e, t, r) {
        if (!d(e)) throw new TypeError('Expected Hash');
        if (!b(t)) throw new TypeError('Expected Private');
        if (void 0 !== r && !d(r))
          throw new TypeError('Expected Extra Data (32 bytes)');
        const n = v(t),
          i = v(e);
        let a, s;
        o(
          e,
          t,
          function (e) {
            const t = v(e),
              r = l.mul(t);
            return (
              !r.isInfinity() &&
              ((a = r.x.umod(c)),
              0 !== a.isZero() &&
                ((s = t
                  .invm(c)
                  .mul(i.add(n.mul(a)))
                  .umod(c)),
                0 !== s.isZero()))
            );
          },
          b,
          r
        ),
          s.cmp(f) > 0 && (s = c.sub(s));
        const u = Buffer.allocUnsafe(64);
        return y(a).copy(u, 0), y(s).copy(u, 32), u;
      }
      e.exports = {
        isPoint: p,
        isPointCompressed: function (e) {
          return !!p(e) && m(e);
        },
        isPrivate: b,
        pointAdd: function (e, t, r) {
          if (!p(e)) throw new TypeError('Expected Point');
          if (!p(t)) throw new TypeError('Expected Point');
          const n = w(e),
            i = w(t),
            o = n.add(i);
          return o.isInfinity() ? null : _(o, g(r, e));
        },
        pointAddScalar: function (e, t, r) {
          if (!p(e)) throw new TypeError('Expected Point');
          if (!h(t)) throw new TypeError('Expected Tweak');
          const n = g(r, e),
            i = w(e);
          if (0 === t.compare(a)) return _(i, n);
          const o = v(t),
            s = l.mul(o),
            u = i.add(s);
          return u.isInfinity() ? null : _(u, n);
        },
        pointCompress: function (e, t) {
          if (!p(e)) throw new TypeError('Expected Point');
          const r = w(e);
          if (r.isInfinity()) throw new TypeError('Expected Point');
          return _(r, t);
        },
        pointFromScalar: function (e, t) {
          if (!b(e)) throw new TypeError('Expected Private');
          const r = v(e),
            n = l.mul(r);
          return n.isInfinity() ? null : _(n, g(t));
        },
        pointMultiply: function (e, t, r) {
          if (!p(e)) throw new TypeError('Expected Point');
          if (!h(t)) throw new TypeError('Expected Tweak');
          const n = g(r, e),
            i = w(e),
            o = v(t),
            a = i.mul(o);
          return a.isInfinity() ? null : _(a, n);
        },
        privateAdd: function (e, t) {
          if (!b(e)) throw new TypeError('Expected Private');
          if (!h(t)) throw new TypeError('Expected Tweak');
          const r = v(e),
            n = v(t),
            i = y(r.add(n).umod(c));
          return b(i) ? i : null;
        },
        privateSub: function (e, t) {
          if (!b(e)) throw new TypeError('Expected Private');
          if (!h(t)) throw new TypeError('Expected Tweak');
          const r = v(e),
            n = v(t),
            i = y(r.sub(n).umod(c));
          return b(i) ? i : null;
        },
        sign: function (e, t) {
          return S(e, t);
        },
        signWithEntropy: function (e, t, r) {
          return S(e, t, r);
        },
        verify: function (e, t, r) {
          if (!d(e)) throw new TypeError('Expected Hash');
          if (!p(t)) throw new TypeError('Expected Point');
          if (
            !(function (e) {
              const t = e.slice(0, 32),
                r = e.slice(32, 64);
              return (
                Buffer.isBuffer(e) &&
                64 === e.length &&
                t.compare(s) < 0 &&
                r.compare(s) < 0
              );
            })(r)
          )
            throw new TypeError('Expected Signature');
          const n = w(t),
            i = v(r.slice(0, 32)),
            o = v(r.slice(32, 64));
          if (i.gtn(0) <= 0) return !1;
          if (o.gtn(0) <= 0) return !1;
          const a = v(e),
            u = o.invm(c),
            f = a.mul(u).umod(c),
            h = i.mul(u).umod(c),
            m = l.mulAdd(f, n, h);
          return !m.isInfinity() && m.x.umod(c).eq(i);
        },
      };
    },
    function (e, t, r) {
      const n = r(58),
        i = Buffer.alloc(1, 1),
        o = Buffer.alloc(1, 0);
      e.exports = function (e, t, r, a, s) {
        let u = Buffer.alloc(32, 0),
          c = Buffer.alloc(32, 1);
        (u = n('sha256', u)
          .update(c)
          .update(o)
          .update(t)
          .update(e)
          .update(s || '')
          .digest()),
          (c = n('sha256', u).update(c).digest()),
          (u = n('sha256', u)
            .update(c)
            .update(i)
            .update(t)
            .update(e)
            .update(s || '')
            .digest()),
          (c = n('sha256', u).update(c).digest()),
          (c = n('sha256', u).update(c).digest());
        let f = c;
        for (; !a(f) || !r(f); )
          (u = n('sha256', u).update(c).update(o).digest()),
            (c = n('sha256', u).update(c).digest()),
            (c = n('sha256', u).update(c).digest()),
            (f = c);
        return f;
      };
    },
    function (e, t, r) {
      var n = r(59),
        i = r(106);
      function o(e) {
        return Buffer.isBuffer(e);
      }
      function a(e) {
        return 'string' == typeof e && /^([0-9a-f]{2})+$/i.test(e);
      }
      function s(e, t) {
        var r = e.toJSON();
        function n(n) {
          if (!e(n)) return !1;
          if (n.length === t) return !0;
          throw i.tfCustomError(
            r + '(Length: ' + t + ')',
            r + '(Length: ' + n.length + ')'
          );
        }
        return (
          (n.toJSON = function () {
            return r;
          }),
          n
        );
      }
      var u = s.bind(null, n.Array),
        c = s.bind(null, o),
        f = s.bind(null, a),
        l = s.bind(null, n.String);
      var d = Math.pow(2, 53) - 1;
      var h = {
        ArrayN: u,
        Buffer: o,
        BufferN: c,
        Finite: function (e) {
          return 'number' == typeof e && isFinite(e);
        },
        Hex: a,
        HexN: f,
        Int8: function (e) {
          return (e << 24) >> 24 === e;
        },
        Int16: function (e) {
          return (e << 16) >> 16 === e;
        },
        Int32: function (e) {
          return (0 | e) === e;
        },
        Int53: function (e) {
          return (
            'number' == typeof e && e >= -d && e <= d && Math.floor(e) === e
          );
        },
        Range: function (e, t, r) {
          function i(n, i) {
            return r(n, i) && n > e && n < t;
          }
          return (
            (r = r || n.Number),
            (i.toJSON = function () {
              return `${r.toJSON()} between [${e}, ${t}]`;
            }),
            i
          );
        },
        StringN: l,
        UInt8: function (e) {
          return (255 & e) === e;
        },
        UInt16: function (e) {
          return (65535 & e) === e;
        },
        UInt32: function (e) {
          return e >>> 0 === e;
        },
        UInt53: function (e) {
          return (
            'number' == typeof e && e >= 0 && e <= d && Math.floor(e) === e
          );
        },
      };
      for (var p in h)
        h[p].toJSON = function (e) {
          return e;
        }.bind(null, p);
      e.exports = h;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(8),
        i = r(0),
        o = r(28),
        a = r(4),
        s = i.OPS;
      t.p2data = function (e, t) {
        if (!e.data && !e.output) throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          a(
            {
              network: a.maybe(a.Object),
              output: a.maybe(a.Buffer),
              data: a.maybe(a.arrayOf(a.Buffer)),
            },
            e
          );
        const r = { name: 'embed', network: e.network || n.bitcoin };
        if (
          (o.prop(r, 'output', () => {
            if (e.data) return i.compile([s.OP_RETURN].concat(e.data));
          }),
          o.prop(r, 'data', () => {
            if (e.output) return i.decompile(e.output).slice(1);
          }),
          t.validate && e.output)
        ) {
          const t = i.decompile(e.output);
          if (t[0] !== s.OP_RETURN) throw new TypeError('Output is invalid');
          if (!t.slice(1).every(a.Buffer))
            throw new TypeError('Output is invalid');
          if (
            e.data &&
            !(function (e, t) {
              return e.length === t.length && e.every((e, r) => e.equals(t[r]));
            })(e.data, r.data)
          )
            throw new TypeError('Data mismatch');
        }
        return Object.assign(r, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.decode = function (e, t, r) {
          (t = t || 4), (r = void 0 === r || r);
          const n = e.length;
          if (0 === n) return 0;
          if (n > t) throw new TypeError('Script number overflow');
          if (r && 0 == (127 & e[n - 1]) && (n <= 1 || 0 == (128 & e[n - 2])))
            throw new Error('Non-minimally encoded script number');
          if (5 === n) {
            const t = e.readUInt32LE(0),
              r = e.readUInt8(4);
            return 128 & r
              ? -(4294967296 * (-129 & r) + t)
              : 4294967296 * r + t;
          }
          let i = 0;
          for (let t = 0; t < n; ++t) i |= e[t] << (8 * t);
          return 128 & e[n - 1] ? -(i & ~(128 << (8 * (n - 1)))) : i;
        }),
        (t.encode = function (e) {
          let t = Math.abs(e);
          const r =
            (n = t) > 2147483647
              ? 5
              : n > 8388607
              ? 4
              : n > 32767
              ? 3
              : n > 127
              ? 2
              : n > 0
              ? 1
              : 0;
          var n;
          const i = Buffer.allocUnsafe(r),
            o = e < 0;
          for (let e = 0; e < r; ++e) i.writeUInt8(255 & t, e), (t >>= 8);
          return (
            128 & i[r - 1]
              ? i.writeUInt8(o ? 128 : 0, r - 1)
              : o && (i[r - 1] |= 128),
            i
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(18),
        i = r(108),
        o = r(4),
        a = Buffer.alloc(1, 0);
      function s(e) {
        let t = 0;
        for (; 0 === e[t]; ) ++t;
        return t === e.length
          ? a
          : 128 & (e = e.slice(t))[0]
          ? Buffer.concat([a, e], 1 + e.length)
          : e;
      }
      function u(e) {
        0 === e[0] && (e = e.slice(1));
        const t = Buffer.alloc(32, 0),
          r = Math.max(0, 32 - e.length);
        return e.copy(t, r), t;
      }
      (t.decode = function (e) {
        const t = e.readUInt8(e.length - 1),
          r = -129 & t;
        if (r <= 0 || r >= 4) throw new Error('Invalid hashType ' + t);
        const n = i.decode(e.slice(0, -1)),
          o = u(n.r),
          a = u(n.s);
        return { signature: Buffer.concat([o, a], 64), hashType: t };
      }),
        (t.encode = function (e, t) {
          o(
            { signature: n.BufferN(64), hashType: n.UInt8 },
            { signature: e, hashType: t }
          );
          const r = -129 & t;
          if (r <= 0 || r >= 4) throw new Error('Invalid hashType ' + t);
          const a = Buffer.allocUnsafe(1);
          a.writeUInt8(t, 0);
          const u = s(e.slice(0, 32)),
            c = s(e.slice(32, 64));
          return Buffer.concat([i.encode(u, c), a]);
        });
    },
    function (e, t, r) {
      var n = r(61);
      function i(e) {
        return e < n.OP_PUSHDATA1 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5;
      }
      e.exports = {
        encodingLength: i,
        encode: function (e, t, r) {
          var o = i(t);
          return (
            1 === o
              ? e.writeUInt8(t, r)
              : 2 === o
              ? (e.writeUInt8(n.OP_PUSHDATA1, r), e.writeUInt8(t, r + 1))
              : 3 === o
              ? (e.writeUInt8(n.OP_PUSHDATA2, r), e.writeUInt16LE(t, r + 1))
              : (e.writeUInt8(n.OP_PUSHDATA4, r), e.writeUInt32LE(t, r + 1)),
            o
          );
        },
        decode: function (e, t) {
          var r,
            i,
            o = e.readUInt8(t);
          if (o < n.OP_PUSHDATA1) (r = o), (i = 1);
          else if (o === n.OP_PUSHDATA1) {
            if (t + 2 > e.length) return null;
            (r = e.readUInt8(t + 1)), (i = 2);
          } else if (o === n.OP_PUSHDATA2) {
            if (t + 3 > e.length) return null;
            (r = e.readUInt16LE(t + 1)), (i = 3);
          } else {
            if (t + 5 > e.length) return null;
            if (o !== n.OP_PUSHDATA4) throw new Error('Unexpected opcode');
            (r = e.readUInt32LE(t + 1)), (i = 5);
          }
          return { opcode: o, number: r, size: i };
        },
      };
    },
    function (e, t, r) {
      var n = r(61),
        i = {};
      for (var o in n) {
        i[n[o]] = o;
      }
      e.exports = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(8),
        i = r(0),
        o = r(28),
        a = i.OPS,
        s = r(4),
        u = r(27),
        c = a.OP_RESERVED;
      function f(e, t) {
        return e.length === t.length && e.every((e, r) => e.equals(t[r]));
      }
      t.p2ms = function (e, t) {
        if (
          !(
            e.input ||
            e.output ||
            (e.pubkeys && void 0 !== e.m) ||
            e.signatures
          )
        )
          throw new TypeError('Not enough data');
        function r(e) {
          return (
            i.isCanonicalScriptSignature(e) ||
            void 0 !== (t.allowIncomplete && e === a.OP_0)
          );
        }
        (t = Object.assign({ validate: !0 }, t || {})),
          s(
            {
              network: s.maybe(s.Object),
              m: s.maybe(s.Number),
              n: s.maybe(s.Number),
              output: s.maybe(s.Buffer),
              pubkeys: s.maybe(s.arrayOf(u.isPoint)),
              signatures: s.maybe(s.arrayOf(r)),
              input: s.maybe(s.Buffer),
            },
            e
          );
        const l = { network: e.network || n.bitcoin };
        let d = [],
          h = !1;
        function p(e) {
          h ||
            ((h = !0),
            (d = i.decompile(e)),
            (l.m = d[0] - c),
            (l.n = d[d.length - 2] - c),
            (l.pubkeys = d.slice(1, -2)));
        }
        if (
          (o.prop(l, 'output', () => {
            if (e.m && l.n && e.pubkeys)
              return i.compile(
                [].concat(c + e.m, e.pubkeys, c + l.n, a.OP_CHECKMULTISIG)
              );
          }),
          o.prop(l, 'm', () => {
            if (l.output) return p(l.output), l.m;
          }),
          o.prop(l, 'n', () => {
            if (l.pubkeys) return l.pubkeys.length;
          }),
          o.prop(l, 'pubkeys', () => {
            if (e.output) return p(e.output), l.pubkeys;
          }),
          o.prop(l, 'signatures', () => {
            if (e.input) return i.decompile(e.input).slice(1);
          }),
          o.prop(l, 'input', () => {
            if (e.signatures) return i.compile([a.OP_0].concat(e.signatures));
          }),
          o.prop(l, 'witness', () => {
            if (l.input) return [];
          }),
          o.prop(l, 'name', () => {
            if (l.m && l.n) return `p2ms(${l.m} of ${l.n})`;
          }),
          t.validate)
        ) {
          if (e.output) {
            if ((p(e.output), !s.Number(d[0])))
              throw new TypeError('Output is invalid');
            if (!s.Number(d[d.length - 2]))
              throw new TypeError('Output is invalid');
            if (d[d.length - 1] !== a.OP_CHECKMULTISIG)
              throw new TypeError('Output is invalid');
            if (l.m <= 0 || l.n > 16 || l.m > l.n || l.n !== d.length - 3)
              throw new TypeError('Output is invalid');
            if (!l.pubkeys.every((e) => u.isPoint(e)))
              throw new TypeError('Output is invalid');
            if (void 0 !== e.m && e.m !== l.m)
              throw new TypeError('m mismatch');
            if (void 0 !== e.n && e.n !== l.n)
              throw new TypeError('n mismatch');
            if (e.pubkeys && !f(e.pubkeys, l.pubkeys))
              throw new TypeError('Pubkeys mismatch');
          }
          if (e.pubkeys) {
            if (void 0 !== e.n && e.n !== e.pubkeys.length)
              throw new TypeError('Pubkey count mismatch');
            if (((l.n = e.pubkeys.length), l.n < l.m))
              throw new TypeError('Pubkey count cannot be less than m');
          }
          if (e.signatures) {
            if (e.signatures.length < l.m)
              throw new TypeError('Not enough signatures provided');
            if (e.signatures.length > l.m)
              throw new TypeError('Too many signatures provided');
          }
          if (e.input) {
            if (e.input[0] !== a.OP_0) throw new TypeError('Input is invalid');
            if (0 === l.signatures.length || !l.signatures.every(r))
              throw new TypeError('Input has invalid signature(s)');
            if (e.signatures && !f(e.signatures, l.signatures))
              throw new TypeError('Signature mismatch');
            if (void 0 !== e.m && e.m !== e.signatures.length)
              throw new TypeError('Signature count mismatch');
          }
        }
        return Object.assign(l, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(8),
        i = r(0),
        o = r(28),
        a = r(4),
        s = i.OPS,
        u = r(27);
      t.p2pk = function (e, t) {
        if (!(e.input || e.output || e.pubkey || e.input || e.signature))
          throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          a(
            {
              network: a.maybe(a.Object),
              output: a.maybe(a.Buffer),
              pubkey: a.maybe(u.isPoint),
              signature: a.maybe(i.isCanonicalScriptSignature),
              input: a.maybe(a.Buffer),
            },
            e
          );
        const r = o.value(() => i.decompile(e.input)),
          c = { name: 'p2pk', network: e.network || n.bitcoin };
        if (
          (o.prop(c, 'output', () => {
            if (e.pubkey) return i.compile([e.pubkey, s.OP_CHECKSIG]);
          }),
          o.prop(c, 'pubkey', () => {
            if (e.output) return e.output.slice(1, -1);
          }),
          o.prop(c, 'signature', () => {
            if (e.input) return r()[0];
          }),
          o.prop(c, 'input', () => {
            if (e.signature) return i.compile([e.signature]);
          }),
          o.prop(c, 'witness', () => {
            if (c.input) return [];
          }),
          t.validate)
        ) {
          if (e.output) {
            if (e.output[e.output.length - 1] !== s.OP_CHECKSIG)
              throw new TypeError('Output is invalid');
            if (!u.isPoint(c.pubkey))
              throw new TypeError('Output pubkey is invalid');
            if (e.pubkey && !e.pubkey.equals(c.pubkey))
              throw new TypeError('Pubkey mismatch');
          }
          if (e.signature && e.input && !e.input.equals(c.input))
            throw new TypeError('Signature mismatch');
          if (e.input) {
            if (1 !== r().length) throw new TypeError('Input is invalid');
            if (!i.isCanonicalScriptSignature(c.signature))
              throw new TypeError('Input has invalid signature');
          }
        }
        return Object.assign(c, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(19),
        i = r(8),
        o = r(0),
        a = r(28),
        s = r(4),
        u = o.OPS,
        c = r(27),
        f = r(37);
      t.p2pkh = function (e, t) {
        if (!(e.address || e.hash || e.output || e.pubkey || e.input))
          throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          s(
            {
              network: s.maybe(s.Object),
              address: s.maybe(s.String),
              hash: s.maybe(s.BufferN(20)),
              output: s.maybe(s.BufferN(25)),
              pubkey: s.maybe(c.isPoint),
              signature: s.maybe(o.isCanonicalScriptSignature),
              input: s.maybe(s.Buffer),
            },
            e
          );
        const r = a.value(() => {
            const t = f.decode(e.address);
            return { version: t.readUInt8(0), hash: t.slice(1) };
          }),
          l = a.value(() => o.decompile(e.input)),
          d = e.network || i.bitcoin,
          h = { name: 'p2pkh', network: d };
        if (
          (a.prop(h, 'address', () => {
            if (!h.hash) return;
            const e = Buffer.allocUnsafe(21);
            return (
              e.writeUInt8(d.pubKeyHash, 0), h.hash.copy(e, 1), f.encode(e)
            );
          }),
          a.prop(h, 'hash', () =>
            e.output
              ? e.output.slice(3, 23)
              : e.address
              ? r().hash
              : e.pubkey || h.pubkey
              ? n.hash160(e.pubkey || h.pubkey)
              : void 0
          ),
          a.prop(h, 'output', () => {
            if (h.hash)
              return o.compile([
                u.OP_DUP,
                u.OP_HASH160,
                h.hash,
                u.OP_EQUALVERIFY,
                u.OP_CHECKSIG,
              ]);
          }),
          a.prop(h, 'pubkey', () => {
            if (e.input) return l()[1];
          }),
          a.prop(h, 'signature', () => {
            if (e.input) return l()[0];
          }),
          a.prop(h, 'input', () => {
            if (e.pubkey && e.signature)
              return o.compile([e.signature, e.pubkey]);
          }),
          a.prop(h, 'witness', () => {
            if (h.input) return [];
          }),
          t.validate)
        ) {
          let t = Buffer.from([]);
          if (e.address) {
            if (r().version !== d.pubKeyHash)
              throw new TypeError('Invalid version or Network mismatch');
            if (20 !== r().hash.length) throw new TypeError('Invalid address');
            t = r().hash;
          }
          if (e.hash) {
            if (t.length > 0 && !t.equals(e.hash))
              throw new TypeError('Hash mismatch');
            t = e.hash;
          }
          if (e.output) {
            if (
              25 !== e.output.length ||
              e.output[0] !== u.OP_DUP ||
              e.output[1] !== u.OP_HASH160 ||
              20 !== e.output[2] ||
              e.output[23] !== u.OP_EQUALVERIFY ||
              e.output[24] !== u.OP_CHECKSIG
            )
              throw new TypeError('Output is invalid');
            const r = e.output.slice(3, 23);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
            t = r;
          }
          if (e.pubkey) {
            const r = n.hash160(e.pubkey);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
            t = r;
          }
          if (e.input) {
            const r = l();
            if (2 !== r.length) throw new TypeError('Input is invalid');
            if (!o.isCanonicalScriptSignature(r[0]))
              throw new TypeError('Input has invalid signature');
            if (!c.isPoint(r[1]))
              throw new TypeError('Input has invalid pubkey');
            if (e.signature && !e.signature.equals(r[0]))
              throw new TypeError('Signature mismatch');
            if (e.pubkey && !e.pubkey.equals(r[1]))
              throw new TypeError('Pubkey mismatch');
            const i = n.hash160(r[1]);
            if (t.length > 0 && !t.equals(i))
              throw new TypeError('Hash mismatch');
          }
        }
        return Object.assign(h, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(19),
        i = r(8),
        o = r(0),
        a = r(28),
        s = r(4),
        u = o.OPS,
        c = r(37);
      t.p2sh = function (e, t) {
        if (!(e.address || e.hash || e.output || e.redeem || e.input))
          throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          s(
            {
              network: s.maybe(s.Object),
              address: s.maybe(s.String),
              hash: s.maybe(s.BufferN(20)),
              output: s.maybe(s.BufferN(23)),
              redeem: s.maybe({
                network: s.maybe(s.Object),
                output: s.maybe(s.Buffer),
                input: s.maybe(s.Buffer),
                witness: s.maybe(s.arrayOf(s.Buffer)),
              }),
              input: s.maybe(s.Buffer),
              witness: s.maybe(s.arrayOf(s.Buffer)),
            },
            e
          );
        let r = e.network;
        r || (r = (e.redeem && e.redeem.network) || i.bitcoin);
        const f = { network: r },
          l = a.value(() => {
            const t = c.decode(e.address);
            return { version: t.readUInt8(0), hash: t.slice(1) };
          }),
          d = a.value(() => o.decompile(e.input)),
          h = a.value(() => {
            const t = d();
            return {
              network: r,
              output: t[t.length - 1],
              input: o.compile(t.slice(0, -1)),
              witness: e.witness || [],
            };
          });
        if (
          (a.prop(f, 'address', () => {
            if (!f.hash) return;
            const e = Buffer.allocUnsafe(21);
            return (
              e.writeUInt8(f.network.scriptHash, 0),
              f.hash.copy(e, 1),
              c.encode(e)
            );
          }),
          a.prop(f, 'hash', () =>
            e.output
              ? e.output.slice(2, 22)
              : e.address
              ? l().hash
              : f.redeem && f.redeem.output
              ? n.hash160(f.redeem.output)
              : void 0
          ),
          a.prop(f, 'output', () => {
            if (f.hash) return o.compile([u.OP_HASH160, f.hash, u.OP_EQUAL]);
          }),
          a.prop(f, 'redeem', () => {
            if (e.input) return h();
          }),
          a.prop(f, 'input', () => {
            if (e.redeem && e.redeem.input && e.redeem.output)
              return o.compile(
                [].concat(o.decompile(e.redeem.input), e.redeem.output)
              );
          }),
          a.prop(f, 'witness', () =>
            f.redeem && f.redeem.witness
              ? f.redeem.witness
              : f.input
              ? []
              : void 0
          ),
          a.prop(f, 'name', () => {
            const e = ['p2sh'];
            return void 0 !== f.redeem && e.push(f.redeem.name), e.join('-');
          }),
          t.validate)
        ) {
          let t = Buffer.from([]);
          if (e.address) {
            if (l().version !== r.scriptHash)
              throw new TypeError('Invalid version or Network mismatch');
            if (20 !== l().hash.length) throw new TypeError('Invalid address');
            t = l().hash;
          }
          if (e.hash) {
            if (t.length > 0 && !t.equals(e.hash))
              throw new TypeError('Hash mismatch');
            t = e.hash;
          }
          if (e.output) {
            if (
              23 !== e.output.length ||
              e.output[0] !== u.OP_HASH160 ||
              20 !== e.output[1] ||
              e.output[22] !== u.OP_EQUAL
            )
              throw new TypeError('Output is invalid');
            const r = e.output.slice(2, 22);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
            t = r;
          }
          const i = (e) => {
            if (e.output) {
              const r = o.decompile(e.output);
              if (!r || r.length < 1)
                throw new TypeError('Redeem.output too short');
              const i = n.hash160(e.output);
              if (t.length > 0 && !t.equals(i))
                throw new TypeError('Hash mismatch');
              t = i;
            }
            if (e.input) {
              const t = e.input.length > 0,
                r = e.witness && e.witness.length > 0;
              if (!t && !r) throw new TypeError('Empty input');
              if (t && r) throw new TypeError('Input and witness provided');
              if (t) {
                const t = o.decompile(e.input);
                if (!o.isPushOnly(t))
                  throw new TypeError('Non push-only scriptSig');
              }
            }
          };
          if (e.input) {
            const e = d();
            if (!e || e.length < 1) throw new TypeError('Input too short');
            if (!Buffer.isBuffer(h().output))
              throw new TypeError('Input is invalid');
            i(h());
          }
          if (e.redeem) {
            if (e.redeem.network && e.redeem.network !== r)
              throw new TypeError('Network mismatch');
            if (e.input) {
              const t = h();
              if (e.redeem.output && !e.redeem.output.equals(t.output))
                throw new TypeError('Redeem.output mismatch');
              if (e.redeem.input && !e.redeem.input.equals(t.input))
                throw new TypeError('Redeem.input mismatch');
            }
            i(e.redeem);
          }
          if (
            e.witness &&
            e.redeem &&
            e.redeem.witness &&
            !(function (e, t) {
              return e.length === t.length && e.every((e, r) => e.equals(t[r]));
            })(e.redeem.witness, e.witness)
          )
            throw new TypeError('Witness and redeem.witness mismatch');
        }
        return Object.assign(f, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(19),
        i = r(8),
        o = r(0),
        a = r(28),
        s = r(4),
        u = o.OPS,
        c = r(27),
        f = r(45),
        l = Buffer.alloc(0);
      t.p2wpkh = function (e, t) {
        if (!(e.address || e.hash || e.output || e.pubkey || e.witness))
          throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          s(
            {
              address: s.maybe(s.String),
              hash: s.maybe(s.BufferN(20)),
              input: s.maybe(s.BufferN(0)),
              network: s.maybe(s.Object),
              output: s.maybe(s.BufferN(22)),
              pubkey: s.maybe(c.isPoint),
              signature: s.maybe(o.isCanonicalScriptSignature),
              witness: s.maybe(s.arrayOf(s.Buffer)),
            },
            e
          );
        const r = a.value(() => {
            const t = f.decode(e.address),
              r = t.words.shift(),
              n = f.fromWords(t.words);
            return { version: r, prefix: t.prefix, data: Buffer.from(n) };
          }),
          d = e.network || i.bitcoin,
          h = { name: 'p2wpkh', network: d };
        if (
          (a.prop(h, 'address', () => {
            if (!h.hash) return;
            const e = f.toWords(h.hash);
            return e.unshift(0), f.encode(d.bech32, e);
          }),
          a.prop(h, 'hash', () =>
            e.output
              ? e.output.slice(2, 22)
              : e.address
              ? r().data
              : e.pubkey || h.pubkey
              ? n.hash160(e.pubkey || h.pubkey)
              : void 0
          ),
          a.prop(h, 'output', () => {
            if (h.hash) return o.compile([u.OP_0, h.hash]);
          }),
          a.prop(h, 'pubkey', () =>
            e.pubkey ? e.pubkey : e.witness ? e.witness[1] : void 0
          ),
          a.prop(h, 'signature', () => {
            if (e.witness) return e.witness[0];
          }),
          a.prop(h, 'input', () => {
            if (h.witness) return l;
          }),
          a.prop(h, 'witness', () => {
            if (e.pubkey && e.signature) return [e.signature, e.pubkey];
          }),
          t.validate)
        ) {
          let t = Buffer.from([]);
          if (e.address) {
            if (d && d.bech32 !== r().prefix)
              throw new TypeError('Invalid prefix or Network mismatch');
            if (0 !== r().version)
              throw new TypeError('Invalid address version');
            if (20 !== r().data.length)
              throw new TypeError('Invalid address data');
            t = r().data;
          }
          if (e.hash) {
            if (t.length > 0 && !t.equals(e.hash))
              throw new TypeError('Hash mismatch');
            t = e.hash;
          }
          if (e.output) {
            if (
              22 !== e.output.length ||
              e.output[0] !== u.OP_0 ||
              20 !== e.output[1]
            )
              throw new TypeError('Output is invalid');
            if (t.length > 0 && !t.equals(e.output.slice(2)))
              throw new TypeError('Hash mismatch');
            t = e.output.slice(2);
          }
          if (e.pubkey) {
            const r = n.hash160(e.pubkey);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
            t = r;
          }
          if (e.witness) {
            if (2 !== e.witness.length)
              throw new TypeError('Witness is invalid');
            if (!o.isCanonicalScriptSignature(e.witness[0]))
              throw new TypeError('Witness has invalid signature');
            if (!c.isPoint(e.witness[1]))
              throw new TypeError('Witness has invalid pubkey');
            if (e.signature && !e.signature.equals(e.witness[0]))
              throw new TypeError('Signature mismatch');
            if (e.pubkey && !e.pubkey.equals(e.witness[1]))
              throw new TypeError('Pubkey mismatch');
            const r = n.hash160(e.witness[1]);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
          }
        }
        return Object.assign(h, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(19),
        i = r(8),
        o = r(0),
        a = r(28),
        s = r(4),
        u = o.OPS,
        c = r(45),
        f = Buffer.alloc(0);
      t.p2wsh = function (e, t) {
        if (!(e.address || e.hash || e.output || e.redeem || e.witness))
          throw new TypeError('Not enough data');
        (t = Object.assign({ validate: !0 }, t || {})),
          s(
            {
              network: s.maybe(s.Object),
              address: s.maybe(s.String),
              hash: s.maybe(s.BufferN(32)),
              output: s.maybe(s.BufferN(34)),
              redeem: s.maybe({
                input: s.maybe(s.Buffer),
                network: s.maybe(s.Object),
                output: s.maybe(s.Buffer),
                witness: s.maybe(s.arrayOf(s.Buffer)),
              }),
              input: s.maybe(s.BufferN(0)),
              witness: s.maybe(s.arrayOf(s.Buffer)),
            },
            e
          );
        const r = a.value(() => {
            const t = c.decode(e.address),
              r = t.words.shift(),
              n = c.fromWords(t.words);
            return { version: r, prefix: t.prefix, data: Buffer.from(n) };
          }),
          l = a.value(() => o.decompile(e.redeem.input));
        let d = e.network;
        d || (d = (e.redeem && e.redeem.network) || i.bitcoin);
        const h = { network: d };
        if (
          (a.prop(h, 'address', () => {
            if (!h.hash) return;
            const e = c.toWords(h.hash);
            return e.unshift(0), c.encode(d.bech32, e);
          }),
          a.prop(h, 'hash', () =>
            e.output
              ? e.output.slice(2)
              : e.address
              ? r().data
              : h.redeem && h.redeem.output
              ? n.sha256(h.redeem.output)
              : void 0
          ),
          a.prop(h, 'output', () => {
            if (h.hash) return o.compile([u.OP_0, h.hash]);
          }),
          a.prop(h, 'redeem', () => {
            if (e.witness)
              return {
                output: e.witness[e.witness.length - 1],
                input: f,
                witness: e.witness.slice(0, -1),
              };
          }),
          a.prop(h, 'input', () => {
            if (h.witness) return f;
          }),
          a.prop(h, 'witness', () => {
            if (
              e.redeem &&
              e.redeem.input &&
              e.redeem.input.length > 0 &&
              e.redeem.output &&
              e.redeem.output.length > 0
            ) {
              const t = o.toStack(l());
              return (
                (h.redeem = Object.assign({ witness: t }, e.redeem)),
                (h.redeem.input = f),
                [].concat(t, e.redeem.output)
              );
            }
            if (e.redeem && e.redeem.output && e.redeem.witness)
              return [].concat(e.redeem.witness, e.redeem.output);
          }),
          a.prop(h, 'name', () => {
            const e = ['p2wsh'];
            return void 0 !== h.redeem && e.push(h.redeem.name), e.join('-');
          }),
          t.validate)
        ) {
          let t = Buffer.from([]);
          if (e.address) {
            if (r().prefix !== d.bech32)
              throw new TypeError('Invalid prefix or Network mismatch');
            if (0 !== r().version)
              throw new TypeError('Invalid address version');
            if (32 !== r().data.length)
              throw new TypeError('Invalid address data');
            t = r().data;
          }
          if (e.hash) {
            if (t.length > 0 && !t.equals(e.hash))
              throw new TypeError('Hash mismatch');
            t = e.hash;
          }
          if (e.output) {
            if (
              34 !== e.output.length ||
              e.output[0] !== u.OP_0 ||
              32 !== e.output[1]
            )
              throw new TypeError('Output is invalid');
            const r = e.output.slice(2);
            if (t.length > 0 && !t.equals(r))
              throw new TypeError('Hash mismatch');
            t = r;
          }
          if (e.redeem) {
            if (e.redeem.network && e.redeem.network !== d)
              throw new TypeError('Network mismatch');
            if (
              e.redeem.input &&
              e.redeem.input.length > 0 &&
              e.redeem.witness &&
              e.redeem.witness.length > 0
            )
              throw new TypeError('Ambiguous witness source');
            if (e.redeem.output) {
              if (0 === o.decompile(e.redeem.output).length)
                throw new TypeError('Redeem.output is invalid');
              const r = n.sha256(e.redeem.output);
              if (t.length > 0 && !t.equals(r))
                throw new TypeError('Hash mismatch');
              t = r;
            }
            if (e.redeem.input && !o.isPushOnly(l()))
              throw new TypeError('Non push-only scriptSig');
            if (
              e.witness &&
              e.redeem.witness &&
              !(function (e, t) {
                return (
                  e.length === t.length && e.every((e, r) => e.equals(t[r]))
                );
              })(e.witness, e.redeem.witness)
            )
              throw new TypeError('Witness and redeem.witness mismatch');
          }
          if (
            e.witness &&
            e.redeem &&
            e.redeem.output &&
            !e.redeem.output.equals(e.witness[e.witness.length - 1])
          )
            throw new TypeError('Witness and redeem.output mismatch');
        }
        return Object.assign(h, e);
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(38),
        i = r(19),
        o = r(48),
        a = r(18),
        s = r(223),
        u = r(4),
        c = r(110),
        f = new TypeError('Cannot compute merkle root for zero transactions'),
        l = new TypeError('Cannot compute witness commit for non-segwit block');
      class d {
        constructor() {
          (this.version = 1),
            (this.prevHash = void 0),
            (this.merkleRoot = void 0),
            (this.timestamp = 0),
            (this.witnessCommit = void 0),
            (this.bits = 0),
            (this.nonce = 0),
            (this.transactions = void 0);
        }
        static fromBuffer(e) {
          if (e.length < 80) throw new Error('Buffer too small (< 80 bytes)');
          let t = 0;
          const r = (r) => ((t += r), e.slice(t - r, t)),
            n = () => {
              const r = e.readUInt32LE(t);
              return (t += 4), r;
            },
            i = new d();
          if (
            ((i.version = (() => {
              const r = e.readInt32LE(t);
              return (t += 4), r;
            })()),
            (i.prevHash = r(32)),
            (i.merkleRoot = r(32)),
            (i.timestamp = n()),
            (i.bits = n()),
            (i.nonce = n()),
            80 === e.length)
          )
            return i;
          const a = () => {
              const r = o.Transaction.fromBuffer(e.slice(t), !0);
              return (t += r.byteLength()), r;
            },
            s = (() => {
              const r = c.decode(e, t);
              return (t += c.decode.bytes), r;
            })();
          i.transactions = [];
          for (let e = 0; e < s; ++e) {
            const e = a();
            i.transactions.push(e);
          }
          const u = i.getWitnessCommit();
          return u && (i.witnessCommit = u), i;
        }
        static fromHex(e) {
          return d.fromBuffer(Buffer.from(e, 'hex'));
        }
        static calculateTarget(e) {
          const t = ((4278190080 & e) >> 24) - 3,
            r = 8388607 & e,
            n = Buffer.alloc(32, 0);
          return n.writeUIntBE(r, 29 - t, 3), n;
        }
        static calculateMerkleRoot(e, t) {
          if ((u([{ getHash: a.Function }], e), 0 === e.length)) throw f;
          if (t && !h(e)) throw l;
          const r = e.map((e) => e.getHash(t)),
            n = s(r, i.hash256);
          return t ? i.hash256(Buffer.concat([n, e[0].ins[0].witness[0]])) : n;
        }
        getWitnessCommit() {
          if (!h(this.transactions)) return null;
          const e = this.transactions[0].outs
            .filter((e) =>
              e.script.slice(0, 6).equals(Buffer.from('6a24aa21a9ed', 'hex'))
            )
            .map((e) => e.script.slice(6, 38));
          if (0 === e.length) return null;
          const t = e[e.length - 1];
          return t instanceof Buffer && 32 === t.length ? t : null;
        }
        hasWitnessCommit() {
          return (
            (this.witnessCommit instanceof Buffer &&
              32 === this.witnessCommit.length) ||
            null !== this.getWitnessCommit()
          );
        }
        hasWitness() {
          return (
            (e = this.transactions) instanceof Array &&
            e.some(
              (e) =>
                'object' == typeof e &&
                e.ins instanceof Array &&
                e.ins.some(
                  (e) =>
                    'object' == typeof e &&
                    e.witness instanceof Array &&
                    e.witness.length > 0
                )
            )
          );
          var e;
        }
        weight() {
          return 3 * this.byteLength(!1, !1) + this.byteLength(!1, !0);
        }
        byteLength(e, t = !0) {
          return e || !this.transactions
            ? 80
            : 80 +
                c.encodingLength(this.transactions.length) +
                this.transactions.reduce((e, r) => e + r.byteLength(t), 0);
        }
        getHash() {
          return i.hash256(this.toBuffer(!0));
        }
        getId() {
          return n.reverseBuffer(this.getHash()).toString('hex');
        }
        getUTCDate() {
          const e = new Date(0);
          return e.setUTCSeconds(this.timestamp), e;
        }
        toBuffer(e) {
          const t = Buffer.allocUnsafe(this.byteLength(e));
          let r = 0;
          const n = (e) => {
              e.copy(t, r), (r += e.length);
            },
            i = (e) => {
              t.writeUInt32LE(e, r), (r += 4);
            };
          var o;
          return (
            (o = this.version),
            t.writeInt32LE(o, r),
            (r += 4),
            n(this.prevHash),
            n(this.merkleRoot),
            i(this.timestamp),
            i(this.bits),
            i(this.nonce),
            e ||
              !this.transactions ||
              (c.encode(this.transactions.length, t, r),
              (r += c.encode.bytes),
              this.transactions.forEach((e) => {
                const n = e.byteLength();
                e.toBuffer(t, r), (r += n);
              })),
            t
          );
        }
        toHex(e) {
          return this.toBuffer(e).toString('hex');
        }
        checkTxRoots() {
          const e = this.hasWitnessCommit();
          return (
            !(!e && this.hasWitness()) &&
            this.__checkMerkleRoot() &&
            (!e || this.__checkWitnessCommit())
          );
        }
        checkProofOfWork() {
          const e = n.reverseBuffer(this.getHash()),
            t = d.calculateTarget(this.bits);
          return e.compare(t) <= 0;
        }
        __checkMerkleRoot() {
          if (!this.transactions) throw f;
          const e = d.calculateMerkleRoot(this.transactions);
          return 0 === this.merkleRoot.compare(e);
        }
        __checkWitnessCommit() {
          if (!this.transactions) throw f;
          if (!this.hasWitnessCommit()) throw l;
          const e = d.calculateMerkleRoot(this.transactions, !0);
          return 0 === this.witnessCommit.compare(e);
        }
      }
      function h(e) {
        return (
          e instanceof Array &&
          e[0] &&
          e[0].ins &&
          e[0].ins instanceof Array &&
          e[0].ins[0] &&
          e[0].ins[0].witness &&
          e[0].ins[0].witness instanceof Array &&
          e[0].ins[0].witness.length > 0
        );
      }
      t.Block = d;
    },
    function (e, t) {
      e.exports = function (e, t) {
        if (!Array.isArray(e)) throw TypeError('Expected values Array');
        if ('function' != typeof t) throw TypeError('Expected digest Function');
        for (var r = e.length, n = e.concat(); r > 1; ) {
          for (var i = 0, o = 0; o < r; o += 2, ++i) {
            var a = n[o],
              s = o + 1 === r ? a : n[o + 1],
              u = Buffer.concat([a, s]);
            n[i] = t(u);
          }
          r = i;
        }
        return n[0];
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(225),
        i = r(49),
        o = r(112),
        a = r(60),
        s = r(38),
        u = r(19),
        c = r(62),
        f = r(8),
        l = r(47),
        d = r(0),
        h = r(48),
        p = { network: f.bitcoin, maximumFeeRate: 5e3 };
      class m {
        constructor(e = {}, t = new n.Psbt(new g())) {
          (this.data = t),
            (this.opts = Object.assign({}, p, e)),
            (this.__CACHE = {
              __NON_WITNESS_UTXO_TX_CACHE: [],
              __NON_WITNESS_UTXO_BUF_CACHE: [],
              __TX_IN_CACHE: {},
              __TX: this.data.globalMap.unsignedTx.tx,
            }),
            0 === this.data.inputs.length && this.setVersion(2);
          const r = (e, t, r, n) =>
            Object.defineProperty(e, t, { enumerable: r, writable: n });
          r(this, '__CACHE', !1, !0), r(this, 'opts', !1, !0);
        }
        static fromBase64(e, t = {}) {
          const r = Buffer.from(e, 'base64');
          return this.fromBuffer(r, t);
        }
        static fromHex(e, t = {}) {
          const r = Buffer.from(e, 'hex');
          return this.fromBuffer(r, t);
        }
        static fromBuffer(e, t = {}) {
          const r = n.Psbt.fromBuffer(e, b),
            i = new m(t, r);
          var o, a;
          return (
            (o = i.__CACHE.__TX),
            (a = i.__CACHE),
            o.ins.forEach((e) => {
              I(a, e);
            }),
            i
          );
        }
        get inputCount() {
          return this.data.inputs.length;
        }
        combine(...e) {
          return this.data.combine(...e.map((e) => e.data)), this;
        }
        clone() {
          const e = m.fromBuffer(this.data.toBuffer());
          return (e.opts = JSON.parse(JSON.stringify(this.opts))), e;
        }
        setMaximumFeeRate(e) {
          x(e), (this.opts.maximumFeeRate = e);
        }
        setVersion(e) {
          x(e), T(this.data.inputs, 'setVersion');
          const t = this.__CACHE;
          return (t.__TX.version = e), (t.__EXTRACTED_TX = void 0), this;
        }
        setLocktime(e) {
          x(e), T(this.data.inputs, 'setLocktime');
          const t = this.__CACHE;
          return (t.__TX.locktime = e), (t.__EXTRACTED_TX = void 0), this;
        }
        setInputSequence(e, t) {
          x(t), T(this.data.inputs, 'setInputSequence');
          const r = this.__CACHE;
          if (r.__TX.ins.length <= e) throw new Error('Input index too high');
          return (
            (r.__TX.ins[e].sequence = t), (r.__EXTRACTED_TX = void 0), this
          );
        }
        addInputs(e) {
          return e.forEach((e) => this.addInput(e)), this;
        }
        addInput(e) {
          if (
            arguments.length > 1 ||
            !e ||
            void 0 === e.hash ||
            void 0 === e.index
          )
            throw new Error(
              'Invalid arguments for Psbt.addInput. Requires single object with at least [hash] and [index]'
            );
          T(this.data.inputs, 'addInput');
          const t = this.__CACHE;
          this.data.addInput(e);
          I(t, t.__TX.ins[t.__TX.ins.length - 1]);
          const r = this.data.inputs.length - 1,
            n = this.data.inputs[r];
          return (
            n.nonWitnessUtxo && L(this.__CACHE, n, r),
            (t.__FEE = void 0),
            (t.__FEE_RATE = void 0),
            (t.__EXTRACTED_TX = void 0),
            this
          );
        }
        addOutputs(e) {
          return e.forEach((e) => this.addOutput(e)), this;
        }
        addOutput(e) {
          if (
            arguments.length > 1 ||
            !e ||
            void 0 === e.value ||
            (void 0 === e.address && void 0 === e.script)
          )
            throw new Error(
              'Invalid arguments for Psbt.addOutput. Requires single object with at least [script or address] and [value]'
            );
          T(this.data.inputs, 'addOutput');
          const { address: t } = e;
          if ('string' == typeof t) {
            const { network: r } = this.opts,
              n = a.toOutputScript(t, r);
            e = Object.assign(e, { script: n });
          }
          const r = this.__CACHE;
          return (
            this.data.addOutput(e),
            (r.__FEE = void 0),
            (r.__FEE_RATE = void 0),
            (r.__EXTRACTED_TX = void 0),
            this
          );
        }
        extractTransaction(e) {
          if (!this.data.inputs.every(y)) throw new Error('Not finalized');
          const t = this.__CACHE;
          if (
            (e ||
              (function (e, t, r) {
                const n = t.__FEE_RATE || e.getFeeRate(),
                  i = t.__EXTRACTED_TX.virtualSize(),
                  o = n * i;
                if (n >= r.maximumFeeRate)
                  throw new Error(
                    `Warning: You are paying around ${(o / 1e8).toFixed(
                      8
                    )} in fees, which is ${n} satoshi per byte for a transaction with a VSize of ${i} bytes (segwit counted as 0.25 byte per byte). Use setMaximumFeeRate method to raise your threshold, or pass true to the first arg of extractTransaction.`
                  );
              })(this, t, this.opts),
            t.__EXTRACTED_TX)
          )
            return t.__EXTRACTED_TX;
          const r = t.__TX.clone();
          return H(this.data.inputs, r, t, !0), r;
        }
        getFeeRate() {
          return B('__FEE_RATE', 'fee rate', this.data.inputs, this.__CACHE);
        }
        getFee() {
          return B('__FEE', 'fee', this.data.inputs, this.__CACHE);
        }
        finalizeAllInputs() {
          return (
            o.checkForInput(this.data.inputs, 0),
            D(this.data.inputs.length).forEach((e) => this.finalizeInput(e)),
            this
          );
        }
        finalizeInput(e, t = C) {
          const r = o.checkForInput(this.data.inputs, e),
            { script: n, isP2SH: i, isP2WSH: a, isSegwit: s } = (function (
              e,
              t,
              r
            ) {
              const n = r.__TX,
                i = { script: null, isSegwit: !1, isP2SH: !1, isP2WSH: !1 };
              if (
                ((i.isP2SH = !!t.redeemScript),
                (i.isP2WSH = !!t.witnessScript),
                t.witnessScript)
              )
                i.script = t.witnessScript;
              else if (t.redeemScript) i.script = t.redeemScript;
              else if (t.nonWitnessUtxo) {
                const o = F(r, t, e),
                  a = n.ins[e].index;
                i.script = o.outs[a].script;
              } else t.witnessUtxo && (i.script = t.witnessUtxo.script);
              (t.witnessScript || E(i.script)) && (i.isSegwit = !0);
              return i;
            })(e, r, this.__CACHE);
          if (!n) throw new Error('No script found for input #' + e);
          !(function (e) {
            if (!e.sighashType || !e.partialSig) return;
            const { partialSig: t, sighashType: r } = e;
            t.forEach((e) => {
              const { hashType: t } = d.signature.decode(e.signature);
              if (r !== t)
                throw new Error(
                  'Signature sighash does not match input sighash type'
                );
            });
          })(r);
          const { finalScriptSig: u, finalScriptWitness: c } = t(
            e,
            r,
            n,
            s,
            i,
            a
          );
          if (
            (u && this.data.updateInput(e, { finalScriptSig: u }),
            c && this.data.updateInput(e, { finalScriptWitness: c }),
            !u && !c)
          )
            throw new Error('Unknown error finalizing input #' + e);
          return this.data.clearFinalizedInput(e), this;
        }
        validateSignaturesOfAllInputs() {
          o.checkForInput(this.data.inputs, 0);
          return D(this.data.inputs.length)
            .map((e) => this.validateSignaturesOfInput(e))
            .reduce((e, t) => !0 === t && e, !0);
        }
        validateSignaturesOfInput(e, t) {
          const r = this.data.inputs[e],
            n = (r || {}).partialSig;
          if (!r || !n || n.length < 1)
            throw new Error('No signatures to validate');
          const i = t ? n.filter((e) => e.pubkey.equals(t)) : n;
          if (i.length < 1) throw new Error('No signatures for this pubkey');
          const o = [];
          let a, s, u;
          for (const t of i) {
            const n = d.signature.decode(t.signature),
              { hash: i, script: f } =
                u !== n.hashType
                  ? j(
                      e,
                      Object.assign({}, r, { sighashType: n.hashType }),
                      this.__CACHE
                    )
                  : { hash: a, script: s };
            (u = n.hashType), (a = i), (s = f), O(t.pubkey, f, 'verify');
            const l = c.fromPublicKey(t.pubkey);
            o.push(l.verify(i, n.signature));
          }
          return o.every((e) => !0 === e);
        }
        signAllInputsHD(e, t = [h.Transaction.SIGHASH_ALL]) {
          if (!e || !e.publicKey || !e.fingerprint)
            throw new Error('Need HDSigner to sign input');
          const r = [];
          for (const n of D(this.data.inputs.length))
            try {
              this.signInputHD(n, e, t), r.push(!0);
            } catch (e) {
              r.push(!1);
            }
          if (r.every((e) => !1 === e))
            throw new Error('No inputs were signed');
          return this;
        }
        signAllInputsHDAsync(e, t = [h.Transaction.SIGHASH_ALL]) {
          return new Promise((r, n) => {
            if (!e || !e.publicKey || !e.fingerprint)
              return n(new Error('Need HDSigner to sign input'));
            const i = [],
              o = [];
            for (const r of D(this.data.inputs.length))
              o.push(
                this.signInputHDAsync(r, e, t).then(
                  () => {
                    i.push(!0);
                  },
                  () => {
                    i.push(!1);
                  }
                )
              );
            return Promise.all(o).then(() => {
              if (i.every((e) => !1 === e))
                return n(new Error('No inputs were signed'));
              r();
            });
          });
        }
        signInputHD(e, t, r = [h.Transaction.SIGHASH_ALL]) {
          if (!t || !t.publicKey || !t.fingerprint)
            throw new Error('Need HDSigner to sign input');
          return (
            z(e, this.data.inputs, t).forEach((t) => this.signInput(e, t, r)),
            this
          );
        }
        signInputHDAsync(e, t, r = [h.Transaction.SIGHASH_ALL]) {
          return new Promise((n, i) => {
            if (!t || !t.publicKey || !t.fingerprint)
              return i(new Error('Need HDSigner to sign input'));
            const o = z(e, this.data.inputs, t).map((t) =>
              this.signInputAsync(e, t, r)
            );
            return Promise.all(o)
              .then(() => {
                n();
              })
              .catch(i);
          });
        }
        signAllInputs(e, t = [h.Transaction.SIGHASH_ALL]) {
          if (!e || !e.publicKey) throw new Error('Need Signer to sign input');
          const r = [];
          for (const n of D(this.data.inputs.length))
            try {
              this.signInput(n, e, t), r.push(!0);
            } catch (e) {
              r.push(!1);
            }
          if (r.every((e) => !1 === e))
            throw new Error('No inputs were signed');
          return this;
        }
        signAllInputsAsync(e, t = [h.Transaction.SIGHASH_ALL]) {
          return new Promise((r, n) => {
            if (!e || !e.publicKey)
              return n(new Error('Need Signer to sign input'));
            const i = [],
              o = [];
            for (const [r] of this.data.inputs.entries())
              o.push(
                this.signInputAsync(r, e, t).then(
                  () => {
                    i.push(!0);
                  },
                  () => {
                    i.push(!1);
                  }
                )
              );
            return Promise.all(o).then(() => {
              if (i.every((e) => !1 === e))
                return n(new Error('No inputs were signed'));
              r();
            });
          });
        }
        signInput(e, t, r = [h.Transaction.SIGHASH_ALL]) {
          if (!t || !t.publicKey) throw new Error('Need Signer to sign input');
          const { hash: n, sighashType: i } = R(
              this.data.inputs,
              e,
              t.publicKey,
              this.__CACHE,
              r
            ),
            o = [
              {
                pubkey: t.publicKey,
                signature: d.signature.encode(t.sign(n), i),
              },
            ];
          return this.data.updateInput(e, { partialSig: o }), this;
        }
        signInputAsync(e, t, r = [h.Transaction.SIGHASH_ALL]) {
          return new Promise((n, i) => {
            if (!t || !t.publicKey)
              return i(new Error('Need Signer to sign input'));
            const { hash: o, sighashType: a } = R(
              this.data.inputs,
              e,
              t.publicKey,
              this.__CACHE,
              r
            );
            Promise.resolve(t.sign(o)).then((r) => {
              const i = [
                { pubkey: t.publicKey, signature: d.signature.encode(r, a) },
              ];
              this.data.updateInput(e, { partialSig: i }), n();
            });
          });
        }
        toBuffer() {
          return this.data.toBuffer();
        }
        toHex() {
          return this.data.toHex();
        }
        toBase64() {
          return this.data.toBase64();
        }
        updateGlobal(e) {
          return this.data.updateGlobal(e), this;
        }
        updateInput(e, t) {
          return (
            this.data.updateInput(e, t),
            t.nonWitnessUtxo && L(this.__CACHE, this.data.inputs[e], e),
            this
          );
        }
        updateOutput(e, t) {
          return this.data.updateOutput(e, t), this;
        }
        addUnknownKeyValToGlobal(e) {
          return this.data.addUnknownKeyValToGlobal(e), this;
        }
        addUnknownKeyValToInput(e, t) {
          return this.data.addUnknownKeyValToInput(e, t), this;
        }
        addUnknownKeyValToOutput(e, t) {
          return this.data.addUnknownKeyValToOutput(e, t), this;
        }
        clearFinalizedInput(e) {
          return this.data.clearFinalizedInput(e), this;
        }
      }
      t.Psbt = m;
      const b = (e) => new g(e);
      class g {
        constructor(e = Buffer.from([2, 0, 0, 0, 0, 0, 0, 0, 0, 0])) {
          (this.tx = h.Transaction.fromBuffer(e)),
            (function (e) {
              if (
                !e.ins.every(
                  (e) =>
                    e.script &&
                    0 === e.script.length &&
                    e.witness &&
                    0 === e.witness.length
                )
              )
                throw new Error(
                  'Format Error: Transaction ScriptSigs are not empty'
                );
            })(this.tx),
            Object.defineProperty(this, 'tx', { enumerable: !1, writable: !0 });
        }
        getInputOutputCounts() {
          return {
            inputCount: this.tx.ins.length,
            outputCount: this.tx.outs.length,
          };
        }
        addInput(e) {
          if (
            void 0 === e.hash ||
            void 0 === e.index ||
            (!Buffer.isBuffer(e.hash) && 'string' != typeof e.hash) ||
            'number' != typeof e.index
          )
            throw new Error('Error adding input.');
          const t =
            'string' == typeof e.hash
              ? s.reverseBuffer(Buffer.from(e.hash, 'hex'))
              : e.hash;
          this.tx.addInput(t, e.index, e.sequence);
        }
        addOutput(e) {
          if (
            void 0 === e.script ||
            void 0 === e.value ||
            !Buffer.isBuffer(e.script) ||
            'number' != typeof e.value
          )
            throw new Error('Error adding output.');
          this.tx.addOutput(e.script, e.value);
        }
        toBuffer() {
          return this.tx.toBuffer();
        }
      }
      function v(e, t, r) {
        if (!t) return !1;
        let n;
        if (
          ((n = r
            ? r
                .map((e) => {
                  const r = c.fromPublicKey(e, { compressed: !0 }).publicKey;
                  return t.find((e) => e.pubkey.equals(r));
                })
                .filter((e) => !!e)
            : t),
          n.length > e)
        )
          throw new Error('Too many signatures');
        return n.length === e;
      }
      function y(e) {
        return !!e.finalScriptSig || !!e.finalScriptWitness;
      }
      function w(e) {
        return (t) => {
          try {
            return e({ output: t }), !0;
          } catch (e) {
            return !1;
          }
        };
      }
      const _ = w(l.p2ms),
        S = w(l.p2pk),
        M = w(l.p2pkh),
        E = w(l.p2wpkh),
        k = w(l.p2wsh);
      function x(e) {
        if (
          'number' != typeof e ||
          e !== Math.floor(e) ||
          e > 4294967295 ||
          e < 0
        )
          throw new Error('Invalid 32 bit integer');
      }
      function T(e, t) {
        e.forEach((e) => {
          let r = !1,
            n = [];
          if (0 === (e.partialSig || []).length) {
            if (!e.finalScriptSig && !e.finalScriptWitness) return;
            n = (function (e) {
              const t =
                  (e.finalScriptSig && d.decompile(e.finalScriptSig)) || [],
                r =
                  (e.finalScriptWitness && d.decompile(e.finalScriptWitness)) ||
                  [];
              return t
                .concat(r)
                .filter(
                  (e) => Buffer.isBuffer(e) && d.isCanonicalScriptSignature(e)
                )
                .map((e) => ({ signature: e }));
            })(e);
          } else n = e.partialSig;
          if (
            (n.forEach((e) => {
              const { hashType: n } = d.signature.decode(e.signature),
                i = [];
              n & h.Transaction.SIGHASH_ANYONECANPAY && i.push('addInput');
              switch (31 & n) {
                case h.Transaction.SIGHASH_ALL:
                  break;
                case h.Transaction.SIGHASH_SINGLE:
                case h.Transaction.SIGHASH_NONE:
                  i.push('addOutput'), i.push('setInputSequence');
              }
              -1 === i.indexOf(t) && (r = !0);
            }),
            r)
          )
            throw new Error('Can not modify transaction, signatures exist.');
        });
      }
      function O(e, t, r) {
        const n = u.hash160(e),
          i = d.decompile(t);
        if (null === i) throw new Error('Unknown script error');
        if (
          !i.some((t) => 'number' != typeof t && (t.equals(e) || t.equals(n)))
        )
          throw new Error(
            `Can not ${r} for this input with the key ${e.toString('hex')}`
          );
      }
      function I(e, t) {
        const r =
          s.reverseBuffer(Buffer.from(t.hash)).toString('hex') + ':' + t.index;
        if (e.__TX_IN_CACHE[r]) throw new Error('Duplicate input detected.');
        e.__TX_IN_CACHE[r] = 1;
      }
      function A(e, t) {
        return (r, n, i) => {
          const o = e({ redeem: { output: i } }).output;
          if (!n.equals(o))
            throw new Error(
              `${t} for input #${r} doesn't match the scriptPubKey in the prevout`
            );
        };
      }
      const P = A(l.p2sh, 'Redeem script'),
        N = A(l.p2wsh, 'Witness script');
      function B(e, t, r, n) {
        if (!r.every(y))
          throw new Error('PSBT must be finalized to calculate ' + t);
        if ('__FEE_RATE' === e && n.__FEE_RATE) return n.__FEE_RATE;
        if ('__FEE' === e && n.__FEE) return n.__FEE;
        let i,
          o = !0;
        return (
          n.__EXTRACTED_TX
            ? ((i = n.__EXTRACTED_TX), (o = !1))
            : (i = n.__TX.clone()),
          H(r, i, n, o),
          '__FEE_RATE' === e ? n.__FEE_RATE : '__FEE' === e ? n.__FEE : void 0
        );
      }
      function C(e, t, r, n, i, o) {
        const a = (function (e) {
          return E(e)
            ? 'witnesspubkeyhash'
            : M(e)
            ? 'pubkeyhash'
            : _(e)
            ? 'multisig'
            : S(e)
            ? 'pubkey'
            : 'nonstandard';
        })(r);
        if (
          !(function (e, t, r) {
            switch (r) {
              case 'pubkey':
              case 'pubkeyhash':
              case 'witnesspubkeyhash':
                return v(1, e.partialSig);
              case 'multisig':
                const r = l.p2ms({ output: t });
                return v(r.m, e.partialSig, r.pubkeys);
              default:
                return !1;
            }
          })(t, r, a)
        )
          throw new Error('Can not finalize input #' + e);
        return (function (e, t, r, n, i, o) {
          let a, s;
          const u = (function (e, t, r) {
              let n;
              switch (t) {
                case 'multisig':
                  const t = (function (e, t) {
                    return l
                      .p2ms({ output: e })
                      .pubkeys.map(
                        (e) =>
                          (t.filter((t) => t.pubkey.equals(e))[0] || {})
                            .signature
                      )
                      .filter((e) => !!e);
                  })(e, r);
                  n = l.p2ms({ output: e, signatures: t });
                  break;
                case 'pubkey':
                  n = l.p2pk({ output: e, signature: r[0].signature });
                  break;
                case 'pubkeyhash':
                  n = l.p2pkh({
                    output: e,
                    pubkey: r[0].pubkey,
                    signature: r[0].signature,
                  });
                  break;
                case 'witnesspubkeyhash':
                  n = l.p2wpkh({
                    output: e,
                    pubkey: r[0].pubkey,
                    signature: r[0].signature,
                  });
              }
              return n;
            })(e, t, r),
            c = o ? l.p2wsh({ redeem: u }) : null,
            f = i ? l.p2sh({ redeem: c || u }) : null;
          n
            ? ((s = U(c ? c.witness : u.witness)), f && (a = f.input))
            : (a = f ? f.input : u.input);
          return { finalScriptSig: a, finalScriptWitness: s };
        })(r, a, t.partialSig, n, i, o);
      }
      function R(e, t, r, n, i) {
        const a = o.checkForInput(e, t),
          { hash: s, sighashType: u, script: c } = j(t, a, n, i);
        return O(r, c, 'sign'), { hash: s, sighashType: u };
      }
      function j(e, t, r, n) {
        const i = r.__TX,
          o = t.sighashType || h.Transaction.SIGHASH_ALL;
        if (n && n.indexOf(o) < 0) {
          const e = (function (e) {
            let t =
              e & h.Transaction.SIGHASH_ANYONECANPAY
                ? 'SIGHASH_ANYONECANPAY | '
                : '';
            switch (31 & e) {
              case h.Transaction.SIGHASH_ALL:
                t += 'SIGHASH_ALL';
                break;
              case h.Transaction.SIGHASH_SINGLE:
                t += 'SIGHASH_SINGLE';
                break;
              case h.Transaction.SIGHASH_NONE:
                t += 'SIGHASH_NONE';
            }
            return t;
          })(o);
          throw new Error(
            'Sighash type is not allowed. Retry the sign method passing the sighashTypes array of whitelisted types. Sighash type: ' +
              e
          );
        }
        let a, s;
        if (t.nonWitnessUtxo) {
          const n = F(r, t, e),
            u = i.ins[e].hash,
            c = n.getHash();
          if (!u.equals(c))
            throw new Error(
              `Non-witness UTXO hash for input #${e} doesn't match the hash specified in the prevout`
            );
          const f = i.ins[e].index,
            d = n.outs[f];
          if (
            (t.redeemScript
              ? (P(e, d.script, t.redeemScript), (s = t.redeemScript))
              : (s = d.script),
            k(s))
          ) {
            if (!t.witnessScript)
              throw new Error('Segwit input needs witnessScript if not P2WPKH');
            N(e, s, t.witnessScript),
              (a = i.hashForWitnessV0(e, t.witnessScript, d.value, o)),
              (s = t.witnessScript);
          } else if (E(s)) {
            const t = l.p2pkh({ hash: s.slice(2) }).output;
            a = i.hashForWitnessV0(e, t, d.value, o);
          } else a = i.hashForSignature(e, s, o);
        } else {
          if (!t.witnessUtxo)
            throw new Error('Need a Utxo input item for signing');
          {
            let r;
            if (
              (t.redeemScript
                ? (P(e, t.witnessUtxo.script, t.redeemScript),
                  (r = t.redeemScript))
                : (r = t.witnessUtxo.script),
              E(r))
            ) {
              const n = l.p2pkh({ hash: r.slice(2) }).output;
              (a = i.hashForWitnessV0(e, n, t.witnessUtxo.value, o)), (s = r);
            } else {
              if (!k(r))
                throw new Error(
                  `Input #${e} has witnessUtxo but non-segwit script: ` +
                    r.toString('hex')
                );
              if (!t.witnessScript)
                throw new Error(
                  'Segwit input needs witnessScript if not P2WPKH'
                );
              N(e, r, t.witnessScript),
                (a = i.hashForWitnessV0(
                  e,
                  t.witnessScript,
                  t.witnessUtxo.value,
                  o
                )),
                (s = t.witnessScript);
            }
          }
        }
        return { script: s, sighashType: o, hash: a };
      }
      function z(e, t, r) {
        const n = o.checkForInput(t, e);
        if (!n.bip32Derivation || 0 === n.bip32Derivation.length)
          throw new Error('Need bip32Derivation to sign with HD');
        const i = n.bip32Derivation
          .map((e) => (e.masterFingerprint.equals(r.fingerprint) ? e : void 0))
          .filter((e) => !!e);
        if (0 === i.length)
          throw new Error(
            'Need one bip32Derivation masterFingerprint to match the HDSigner fingerprint'
          );
        return i.map((e) => {
          const t = r.derivePath(e.path);
          if (!e.pubkey.equals(t.publicKey))
            throw new Error('pubkey did not match bip32Derivation');
          return t;
        });
      }
      function q(e) {
        let t = 0;
        function r() {
          const r = i.decode(e, t);
          return (t += i.decode.bytes), r;
        }
        function n() {
          return (n = r()), (t += n), e.slice(t - n, t);
          var n;
        }
        return (function () {
          const e = r(),
            t = [];
          for (let r = 0; r < e; r++) t.push(n());
          return t;
        })();
      }
      function U(e) {
        let t = Buffer.allocUnsafe(0);
        function r(e) {
          const r = t.length,
            n = i.encodingLength(e);
          (t = Buffer.concat([t, Buffer.allocUnsafe(n)])), i.encode(e, t, r);
        }
        function n(e) {
          r(e.length),
            (function (e) {
              t = Buffer.concat([t, Buffer.from(e)]);
            })(e);
        }
        var o;
        return r((o = e).length), o.forEach(n), t;
      }
      function L(e, t, r) {
        e.__NON_WITNESS_UTXO_BUF_CACHE[r] = t.nonWitnessUtxo;
        const n = h.Transaction.fromBuffer(t.nonWitnessUtxo);
        e.__NON_WITNESS_UTXO_TX_CACHE[r] = n;
        const i = e,
          o = r;
        delete t.nonWitnessUtxo,
          Object.defineProperty(t, 'nonWitnessUtxo', {
            enumerable: !0,
            get() {
              const e = i.__NON_WITNESS_UTXO_BUF_CACHE[o],
                t = i.__NON_WITNESS_UTXO_TX_CACHE[o];
              if (void 0 !== e) return e;
              {
                const e = t.toBuffer();
                return (i.__NON_WITNESS_UTXO_BUF_CACHE[o] = e), e;
              }
            },
            set(e) {
              i.__NON_WITNESS_UTXO_BUF_CACHE[o] = e;
            },
          });
      }
      function H(e, t, r, n) {
        let i = 0;
        e.forEach((e, o) => {
          if (
            (n && e.finalScriptSig && (t.ins[o].script = e.finalScriptSig),
            n &&
              e.finalScriptWitness &&
              (t.ins[o].witness = q(e.finalScriptWitness)),
            e.witnessUtxo)
          )
            i += e.witnessUtxo.value;
          else if (e.nonWitnessUtxo) {
            const n = F(r, e, o),
              a = t.ins[o].index,
              s = n.outs[a];
            i += s.value;
          }
        });
        const o = t.outs.reduce((e, t) => e + t.value, 0),
          a = i - o;
        if (a < 0) throw new Error('Outputs are spending more than Inputs');
        const s = t.virtualSize();
        (r.__FEE = a),
          (r.__EXTRACTED_TX = t),
          (r.__FEE_RATE = Math.floor(a / s));
      }
      function F(e, t, r) {
        const n = e.__NON_WITNESS_UTXO_TX_CACHE;
        return n[r] || L(e, t, r), n[r];
      }
      function D(e) {
        return [...Array(e).keys()];
      }
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(226),
        i = r(111),
        o = r(9),
        a = r(112);
      t.Psbt = class {
        constructor(e) {
          (this.inputs = []),
            (this.outputs = []),
            (this.globalMap = { unsignedTx: e });
        }
        static fromBase64(e, t) {
          const r = Buffer.from(e, 'base64');
          return this.fromBuffer(r, t);
        }
        static fromHex(e, t) {
          const r = Buffer.from(e, 'hex');
          return this.fromBuffer(r, t);
        }
        static fromBuffer(e, t) {
          const r = i.psbtFromBuffer(e, t),
            n = new this(r.globalMap.unsignedTx);
          return Object.assign(n, r), n;
        }
        toBase64() {
          return this.toBuffer().toString('base64');
        }
        toHex() {
          return this.toBuffer().toString('hex');
        }
        toBuffer() {
          return i.psbtToBuffer(this);
        }
        updateGlobal(e) {
          return a.updateGlobal(e, this.globalMap), this;
        }
        updateInput(e, t) {
          const r = a.checkForInput(this.inputs, e);
          return a.updateInput(t, r), this;
        }
        updateOutput(e, t) {
          const r = a.checkForOutput(this.outputs, e);
          return a.updateOutput(t, r), this;
        }
        addUnknownKeyValToGlobal(e) {
          return (
            a.checkHasKey(
              e,
              this.globalMap.unknownKeyVals,
              a.getEnumLength(o.GlobalTypes)
            ),
            this.globalMap.unknownKeyVals ||
              (this.globalMap.unknownKeyVals = []),
            this.globalMap.unknownKeyVals.push(e),
            this
          );
        }
        addUnknownKeyValToInput(e, t) {
          const r = a.checkForInput(this.inputs, e);
          return (
            a.checkHasKey(t, r.unknownKeyVals, a.getEnumLength(o.InputTypes)),
            r.unknownKeyVals || (r.unknownKeyVals = []),
            r.unknownKeyVals.push(t),
            this
          );
        }
        addUnknownKeyValToOutput(e, t) {
          const r = a.checkForOutput(this.outputs, e);
          return (
            a.checkHasKey(t, r.unknownKeyVals, a.getEnumLength(o.OutputTypes)),
            r.unknownKeyVals || (r.unknownKeyVals = []),
            r.unknownKeyVals.push(t),
            this
          );
        }
        addInput(e) {
          this.globalMap.unsignedTx.addInput(e),
            this.inputs.push({ unknownKeyVals: [] });
          const t = e.unknownKeyVals || [],
            r = this.inputs.length - 1;
          if (!Array.isArray(t))
            throw new Error('unknownKeyVals must be an Array');
          return (
            t.forEach((e) => this.addUnknownKeyValToInput(r, e)),
            a.addInputAttributes(this.inputs, e),
            this
          );
        }
        addOutput(e) {
          this.globalMap.unsignedTx.addOutput(e),
            this.outputs.push({ unknownKeyVals: [] });
          const t = e.unknownKeyVals || [],
            r = this.outputs.length - 1;
          if (!Array.isArray(t))
            throw new Error('unknownKeyVals must be an Array');
          return (
            t.forEach((e) => this.addUnknownKeyValToInput(r, e)),
            a.addOutputAttributes(this.outputs, e),
            this
          );
        }
        clearFinalizedInput(e) {
          const t = a.checkForInput(this.inputs, e);
          a.inputCheckUncleanFinalized(e, t);
          for (const e of Object.keys(t))
            [
              'witnessUtxo',
              'nonWitnessUtxo',
              'finalScriptSig',
              'finalScriptWitness',
              'unknownKeyVals',
            ].includes(e) || delete t[e];
          return this;
        }
        combine(...e) {
          const t = n.combine([this].concat(e));
          return Object.assign(this, t), this;
        }
        getTransaction() {
          return this.globalMap.unsignedTx.toBuffer();
        }
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(111);
      function i(e, t, r) {
        return (n) => {
          if (e.has(n)) return;
          const i = r.filter((e) => e.key.toString('hex') === n)[0];
          t.push(i), e.add(n);
        };
      }
      function o(e) {
        return e.globalMap.unsignedTx;
      }
      function a(e) {
        const t = new Set();
        return (
          e.forEach((e) => {
            const r = e.key.toString('hex');
            if (t.has(r))
              throw new Error('Combine: KeyValue Map keys should be unique');
            t.add(r);
          }),
          t
        );
      }
      t.combine = function (e) {
        const t = e[0],
          r = n.psbtToKeyVals(t),
          s = e.slice(1);
        if (0 === s.length) throw new Error('Combine: Nothing to combine');
        const u = o(t);
        if (void 0 === u) throw new Error('Combine: Self missing transaction');
        const c = a(r.globalKeyVals),
          f = r.inputKeyVals.map(a),
          l = r.outputKeyVals.map(a);
        for (const e of s) {
          const t = o(e);
          if (void 0 === t || !t.toBuffer().equals(u.toBuffer()))
            throw new Error(
              'Combine: One of the Psbts does not have the same transaction.'
            );
          const s = n.psbtToKeyVals(e);
          a(s.globalKeyVals).forEach(i(c, r.globalKeyVals, s.globalKeyVals));
          s.inputKeyVals
            .map(a)
            .forEach((e, t) =>
              e.forEach(i(f[t], r.inputKeyVals[t], s.inputKeyVals[t]))
            );
          s.outputKeyVals
            .map(a)
            .forEach((e, t) =>
              e.forEach(i(l[t], r.outputKeyVals[t], s.outputKeyVals[t]))
            );
        }
        return n.psbtFromKeyVals(u, {
          globalMapKeyVals: r.globalKeyVals,
          inputKeyVals: r.inputKeyVals,
          outputKeyVals: r.outputKeyVals,
        });
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(63),
        i = r(64),
        o = r(49),
        a = r(9);
      function s(e, t, r) {
        if (!t.equals(Buffer.from([r])))
          throw new Error(
            `Format Error: Invalid ${e} key: ${t.toString('hex')}`
          );
      }
      function u(
        e,
        { globalMapKeyVals: t, inputKeyVals: r, outputKeyVals: o }
      ) {
        const u = { unsignedTx: e };
        let c = 0;
        for (const e of t)
          switch (e.key[0]) {
            case a.GlobalTypes.UNSIGNED_TX:
              if ((s('global', e.key, a.GlobalTypes.UNSIGNED_TX), c > 0))
                throw new Error(
                  'Format Error: GlobalMap has multiple UNSIGNED_TX'
                );
              c++;
              break;
            case a.GlobalTypes.GLOBAL_XPUB:
              void 0 === u.globalXpub && (u.globalXpub = []),
                u.globalXpub.push(n.globals.globalXpub.decode(e));
              break;
            default:
              u.unknownKeyVals || (u.unknownKeyVals = []),
                u.unknownKeyVals.push(e);
          }
        const f = r.length,
          l = o.length,
          d = [],
          h = [];
        for (const e of i.range(f)) {
          const t = {};
          for (const i of r[e])
            switch ((n.inputs.checkPubkey(i), i.key[0])) {
              case a.InputTypes.NON_WITNESS_UTXO:
                if (
                  (s('input', i.key, a.InputTypes.NON_WITNESS_UTXO),
                  void 0 !== t.nonWitnessUtxo || void 0 !== t.witnessUtxo)
                )
                  throw new Error(
                    'Format Error: Input has multiple [NON_]WITNESS_UTXO'
                  );
                t.nonWitnessUtxo = n.inputs.nonWitnessUtxo.decode(i);
                break;
              case a.InputTypes.WITNESS_UTXO:
                if (
                  (s('input', i.key, a.InputTypes.WITNESS_UTXO),
                  void 0 !== t.nonWitnessUtxo || void 0 !== t.witnessUtxo)
                )
                  throw new Error(
                    'Format Error: Input has multiple [NON_]WITNESS_UTXO'
                  );
                t.witnessUtxo = n.inputs.witnessUtxo.decode(i);
                break;
              case a.InputTypes.PARTIAL_SIG:
                void 0 === t.partialSig && (t.partialSig = []),
                  t.partialSig.push(n.inputs.partialSig.decode(i));
                break;
              case a.InputTypes.SIGHASH_TYPE:
                if (
                  (s('input', i.key, a.InputTypes.SIGHASH_TYPE),
                  void 0 !== t.sighashType)
                )
                  throw new Error(
                    'Format Error: Input has multiple SIGHASH_TYPE'
                  );
                t.sighashType = n.inputs.sighashType.decode(i);
                break;
              case a.InputTypes.REDEEM_SCRIPT:
                if (
                  (s('input', i.key, a.InputTypes.REDEEM_SCRIPT),
                  void 0 !== t.redeemScript)
                )
                  throw new Error(
                    'Format Error: Input has multiple REDEEM_SCRIPT'
                  );
                t.redeemScript = n.inputs.redeemScript.decode(i);
                break;
              case a.InputTypes.WITNESS_SCRIPT:
                if (
                  (s('input', i.key, a.InputTypes.WITNESS_SCRIPT),
                  void 0 !== t.witnessScript)
                )
                  throw new Error(
                    'Format Error: Input has multiple WITNESS_SCRIPT'
                  );
                t.witnessScript = n.inputs.witnessScript.decode(i);
                break;
              case a.InputTypes.BIP32_DERIVATION:
                void 0 === t.bip32Derivation && (t.bip32Derivation = []),
                  t.bip32Derivation.push(n.inputs.bip32Derivation.decode(i));
                break;
              case a.InputTypes.FINAL_SCRIPTSIG:
                s('input', i.key, a.InputTypes.FINAL_SCRIPTSIG),
                  (t.finalScriptSig = n.inputs.finalScriptSig.decode(i));
                break;
              case a.InputTypes.FINAL_SCRIPTWITNESS:
                s('input', i.key, a.InputTypes.FINAL_SCRIPTWITNESS),
                  (t.finalScriptWitness = n.inputs.finalScriptWitness.decode(
                    i
                  ));
                break;
              case a.InputTypes.POR_COMMITMENT:
                s('input', i.key, a.InputTypes.POR_COMMITMENT),
                  (t.porCommitment = n.inputs.porCommitment.decode(i));
                break;
              default:
                t.unknownKeyVals || (t.unknownKeyVals = []),
                  t.unknownKeyVals.push(i);
            }
          d.push(t);
        }
        for (const e of i.range(l)) {
          const t = {};
          for (const r of o[e])
            switch ((n.outputs.checkPubkey(r), r.key[0])) {
              case a.OutputTypes.REDEEM_SCRIPT:
                if (
                  (s('output', r.key, a.OutputTypes.REDEEM_SCRIPT),
                  void 0 !== t.redeemScript)
                )
                  throw new Error(
                    'Format Error: Output has multiple REDEEM_SCRIPT'
                  );
                t.redeemScript = n.outputs.redeemScript.decode(r);
                break;
              case a.OutputTypes.WITNESS_SCRIPT:
                if (
                  (s('output', r.key, a.OutputTypes.WITNESS_SCRIPT),
                  void 0 !== t.witnessScript)
                )
                  throw new Error(
                    'Format Error: Output has multiple WITNESS_SCRIPT'
                  );
                t.witnessScript = n.outputs.witnessScript.decode(r);
                break;
              case a.OutputTypes.BIP32_DERIVATION:
                void 0 === t.bip32Derivation && (t.bip32Derivation = []),
                  t.bip32Derivation.push(n.outputs.bip32Derivation.decode(r));
                break;
              default:
                t.unknownKeyVals || (t.unknownKeyVals = []),
                  t.unknownKeyVals.push(r);
            }
          h.push(t);
        }
        return { globalMap: u, inputs: d, outputs: h };
      }
      (t.psbtFromBuffer = function (e, t) {
        let r = 0;
        function n() {
          const t = o.decode(e, r);
          r += o.encodingLength(t);
          const n = e.slice(r, r + t);
          return (r += t), n;
        }
        function s() {
          return { key: n(), value: n() };
        }
        function c() {
          if (r >= e.length)
            throw new Error('Format Error: Unexpected End of PSBT');
          const t = 0 === e.readUInt8(r);
          return t && r++, t;
        }
        if (
          1886610036 !==
          (function () {
            const t = e.readUInt32BE(r);
            return (r += 4), t;
          })()
        )
          throw new Error('Format Error: Invalid Magic Number');
        if (
          255 !==
          (function () {
            const t = e.readUInt8(r);
            return (r += 1), t;
          })()
        )
          throw new Error(
            'Format Error: Magic Number must be followed by 0xff separator'
          );
        const f = [],
          l = {};
        for (; !c(); ) {
          const e = s(),
            t = e.key.toString('hex');
          if (l[t])
            throw new Error(
              'Format Error: Keys must be unique for global keymap: key ' + t
            );
          (l[t] = 1), f.push(e);
        }
        const d = f.filter((e) => e.key[0] === a.GlobalTypes.UNSIGNED_TX);
        if (1 !== d.length)
          throw new Error('Format Error: Only one UNSIGNED_TX allowed');
        const h = t(d[0].value),
          { inputCount: p, outputCount: m } = h.getInputOutputCounts(),
          b = [],
          g = [];
        for (const e of i.range(p)) {
          const t = {},
            r = [];
          for (; !c(); ) {
            const n = s(),
              i = n.key.toString('hex');
            if (t[i])
              throw new Error(
                'Format Error: Keys must be unique for each input: input index ' +
                  e +
                  ' key ' +
                  i
              );
            (t[i] = 1), r.push(n);
          }
          b.push(r);
        }
        for (const e of i.range(m)) {
          const t = {},
            r = [];
          for (; !c(); ) {
            const n = s(),
              i = n.key.toString('hex');
            if (t[i])
              throw new Error(
                'Format Error: Keys must be unique for each output: output index ' +
                  e +
                  ' key ' +
                  i
              );
            (t[i] = 1), r.push(n);
          }
          g.push(r);
        }
        return u(h, { globalMapKeyVals: f, inputKeyVals: b, outputKeyVals: g });
      }),
        (t.checkKeyBuffer = s),
        (t.psbtFromKeyVals = u);
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.GlobalTypes.GLOBAL_XPUB)
          throw new Error(
            'Decode Error: could not decode globalXpub with key 0x' +
              e.key.toString('hex')
          );
        if (79 !== e.key.length || ![2, 3].includes(e.key[46]))
          throw new Error(
            'Decode Error: globalXpub has invalid extended pubkey in key 0x' +
              e.key.toString('hex')
          );
        if ((e.value.length / 4) % 1 != 0)
          throw new Error(
            'Decode Error: Global GLOBAL_XPUB value length should be multiple of 4'
          );
        const t = e.key.slice(1),
          r = {
            masterFingerprint: e.value.slice(0, 4),
            extendedPubkey: t,
            path: 'm',
          };
        for (const t of ((i = e.value.length / 4 - 1), [...Array(i).keys()])) {
          const n = e.value.readUInt32LE(4 * t + 4),
            i = !!(2147483648 & n),
            o = 2147483647 & n;
          r.path += '/' + o.toString(10) + (i ? "'" : '');
        }
        var i;
        return r;
      }),
        (t.encode = function (e) {
          const t = Buffer.from([n.GlobalTypes.GLOBAL_XPUB]),
            r = Buffer.concat([t, e.extendedPubkey]),
            i = e.path.split('/'),
            o = Buffer.allocUnsafe(4 * i.length);
          e.masterFingerprint.copy(o, 0);
          let a = 4;
          return (
            i.slice(1).forEach((e) => {
              const t = "'" === e.slice(-1);
              let r = 2147483647 & parseInt(t ? e.slice(0, -1) : e, 10);
              t && (r += 2147483648), o.writeUInt32LE(r, a), (a += 4);
            }),
            { key: r, value: o }
          );
        }),
        (t.expected =
          '{ masterFingerprint: Buffer; extendedPubkey: Buffer; path: string; }'),
        (t.check = function (e) {
          const t = e.extendedPubkey,
            r = e.masterFingerprint,
            n = e.path;
          return (
            Buffer.isBuffer(t) &&
            78 === t.length &&
            [2, 3].indexOf(t[45]) > -1 &&
            Buffer.isBuffer(r) &&
            4 === r.length &&
            'string' == typeof n &&
            !!n.match(/^m(\/\d+'?)+$/)
          );
        }),
        (t.canAddToArray = function (e, t, r) {
          const n = t.extendedPubkey.toString('hex');
          return (
            !r.has(n) &&
            (r.add(n),
            0 ===
              e.filter((e) => e.extendedPubkey.equals(t.extendedPubkey)).length)
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      t.encode = function (e) {
        return {
          key: Buffer.from([n.GlobalTypes.UNSIGNED_TX]),
          value: e.toBuffer(),
        };
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.FINAL_SCRIPTSIG)
          throw new Error(
            'Decode Error: could not decode finalScriptSig with key 0x' +
              e.key.toString('hex')
          );
        return e.value;
      }),
        (t.encode = function (e) {
          return { key: Buffer.from([n.InputTypes.FINAL_SCRIPTSIG]), value: e };
        }),
        (t.expected = 'Buffer'),
        (t.check = function (e) {
          return Buffer.isBuffer(e);
        }),
        (t.canAdd = function (e, t) {
          return !!e && !!t && void 0 === e.finalScriptSig;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.FINAL_SCRIPTWITNESS)
          throw new Error(
            'Decode Error: could not decode finalScriptWitness with key 0x' +
              e.key.toString('hex')
          );
        return e.value;
      }),
        (t.encode = function (e) {
          return {
            key: Buffer.from([n.InputTypes.FINAL_SCRIPTWITNESS]),
            value: e,
          };
        }),
        (t.expected = 'Buffer'),
        (t.check = function (e) {
          return Buffer.isBuffer(e);
        }),
        (t.canAdd = function (e, t) {
          return !!e && !!t && void 0 === e.finalScriptWitness;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.NON_WITNESS_UTXO)
          throw new Error(
            'Decode Error: could not decode nonWitnessUtxo with key 0x' +
              e.key.toString('hex')
          );
        return e.value;
      }),
        (t.encode = function (e) {
          return {
            key: Buffer.from([n.InputTypes.NON_WITNESS_UTXO]),
            value: e,
          };
        }),
        (t.expected = 'Buffer'),
        (t.check = function (e) {
          return Buffer.isBuffer(e);
        }),
        (t.canAdd = function (e, t) {
          return (
            !!e &&
            !!t &&
            void 0 === e.witnessUtxo &&
            void 0 === e.nonWitnessUtxo
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.PARTIAL_SIG)
          throw new Error(
            'Decode Error: could not decode partialSig with key 0x' +
              e.key.toString('hex')
          );
        if (
          (34 !== e.key.length && 66 !== e.key.length) ||
          ![2, 3, 4].includes(e.key[1])
        )
          throw new Error(
            'Decode Error: partialSig has invalid pubkey in key 0x' +
              e.key.toString('hex')
          );
        return { pubkey: e.key.slice(1), signature: e.value };
      }),
        (t.encode = function (e) {
          const t = Buffer.from([n.InputTypes.PARTIAL_SIG]);
          return { key: Buffer.concat([t, e.pubkey]), value: e.signature };
        }),
        (t.expected = '{ pubkey: Buffer; signature: Buffer; }'),
        (t.check = function (e) {
          return (
            Buffer.isBuffer(e.pubkey) &&
            Buffer.isBuffer(e.signature) &&
            [33, 65].includes(e.pubkey.length) &&
            [2, 3, 4].includes(e.pubkey[0]) &&
            (function (e) {
              if (!Buffer.isBuffer(e) || e.length < 9) return !1;
              if (48 !== e[0]) return !1;
              if (e.length !== e[1] + 3) return !1;
              if (2 !== e[2]) return !1;
              const t = e[3];
              if (t > 33 || t < 1) return !1;
              if (2 !== e[3 + t + 1]) return !1;
              const r = e[3 + t + 2];
              return !(r > 33 || r < 1) && e.length === 3 + t + 2 + r + 2;
            })(e.signature)
          );
        }),
        (t.canAddToArray = function (e, t, r) {
          const n = t.pubkey.toString('hex');
          return (
            !r.has(n) &&
            (r.add(n), 0 === e.filter((e) => e.pubkey.equals(t.pubkey)).length)
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.POR_COMMITMENT)
          throw new Error(
            'Decode Error: could not decode porCommitment with key 0x' +
              e.key.toString('hex')
          );
        return e.value.toString('utf8');
      }),
        (t.encode = function (e) {
          return {
            key: Buffer.from([n.InputTypes.POR_COMMITMENT]),
            value: Buffer.from(e, 'utf8'),
          };
        }),
        (t.expected = 'string'),
        (t.check = function (e) {
          return 'string' == typeof e;
        }),
        (t.canAdd = function (e, t) {
          return !!e && !!t && void 0 === e.porCommitment;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.SIGHASH_TYPE)
          throw new Error(
            'Decode Error: could not decode sighashType with key 0x' +
              e.key.toString('hex')
          );
        return e.value.readUInt32LE(0);
      }),
        (t.encode = function (e) {
          const t = Buffer.from([n.InputTypes.SIGHASH_TYPE]),
            r = Buffer.allocUnsafe(4);
          return r.writeUInt32LE(e, 0), { key: t, value: r };
        }),
        (t.expected = 'number'),
        (t.check = function (e) {
          return 'number' == typeof e;
        }),
        (t.canAdd = function (e, t) {
          return !!e && !!t && void 0 === e.sighashType;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(9),
        i = r(64),
        o = r(49);
      (t.decode = function (e) {
        if (e.key[0] !== n.InputTypes.WITNESS_UTXO)
          throw new Error(
            'Decode Error: could not decode witnessUtxo with key 0x' +
              e.key.toString('hex')
          );
        const t = i.readUInt64LE(e.value, 0);
        let r = 8;
        const a = o.decode(e.value, r);
        r += o.encodingLength(a);
        const s = e.value.slice(r);
        if (s.length !== a)
          throw new Error(
            'Decode Error: WITNESS_UTXO script is not proper length'
          );
        return { script: s, value: t };
      }),
        (t.encode = function (e) {
          const { script: t, value: r } = e,
            a = o.encodingLength(t.length),
            s = Buffer.allocUnsafe(8 + a + t.length);
          return (
            i.writeUInt64LE(s, r, 0),
            o.encode(t.length, s, 8),
            t.copy(s, 8 + a),
            { key: Buffer.from([n.InputTypes.WITNESS_UTXO]), value: s }
          );
        }),
        (t.expected = '{ script: Buffer; value: number; }'),
        (t.check = function (e) {
          return Buffer.isBuffer(e.script) && 'number' == typeof e.value;
        }),
        (t.canAdd = function (e, t) {
          return (
            !!e &&
            !!t &&
            void 0 === e.witnessUtxo &&
            void 0 === e.nonWitnessUtxo
          );
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      t.makeConverter = function (e) {
        return {
          decode: function (t) {
            if (t.key[0] !== e)
              throw new Error(
                'Decode Error: could not decode bip32Derivation with key 0x' +
                  t.key.toString('hex')
              );
            if (
              (34 !== t.key.length && 66 !== t.key.length) ||
              ![2, 3, 4].includes(t.key[1])
            )
              throw new Error(
                'Decode Error: bip32Derivation has invalid pubkey in key 0x' +
                  t.key.toString('hex')
              );
            if ((t.value.length / 4) % 1 != 0)
              throw new Error(
                'Decode Error: Input BIP32_DERIVATION value length should be multiple of 4'
              );
            const r = t.key.slice(1),
              n = {
                masterFingerprint: t.value.slice(0, 4),
                pubkey: r,
                path: 'm',
              };
            for (const e of ((i = t.value.length / 4 - 1),
            [...Array(i).keys()])) {
              const r = t.value.readUInt32LE(4 * e + 4),
                i = !!(2147483648 & r),
                o = 2147483647 & r;
              n.path += '/' + o.toString(10) + (i ? "'" : '');
            }
            var i;
            return n;
          },
          encode: function (t) {
            const r = Buffer.from([e]),
              n = Buffer.concat([r, t.pubkey]),
              i = t.path.split('/'),
              o = Buffer.allocUnsafe(4 * i.length);
            t.masterFingerprint.copy(o, 0);
            let a = 4;
            return (
              i.slice(1).forEach((e) => {
                const t = "'" === e.slice(-1);
                let r = 2147483647 & parseInt(t ? e.slice(0, -1) : e, 10);
                t && (r += 2147483648), o.writeUInt32LE(r, a), (a += 4);
              }),
              { key: n, value: o }
            );
          },
          check: function (e) {
            return (
              Buffer.isBuffer(e.pubkey) &&
              Buffer.isBuffer(e.masterFingerprint) &&
              'string' == typeof e.path &&
              [33, 65].includes(e.pubkey.length) &&
              [2, 3, 4].includes(e.pubkey[0]) &&
              4 === e.masterFingerprint.length
            );
          },
          expected:
            '{ masterFingerprint: Buffer; pubkey: Buffer; path: string; }',
          canAddToArray: function (e, t, r) {
            const n = t.pubkey.toString('hex');
            return (
              !r.has(n) &&
              (r.add(n),
              0 === e.filter((e) => e.pubkey.equals(t.pubkey)).length)
            );
          },
        };
      };
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.makeChecker = function (e) {
          return function (t) {
            let r;
            if (
              e.includes(t.key[0]) &&
              ((r = t.key.slice(1)),
              (33 !== r.length && 65 !== r.length) || ![2, 3, 4].includes(r[0]))
            )
              throw new Error(
                'Format Error: invalid pubkey in key 0x' + t.key.toString('hex')
              );
            return r;
          };
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.makeConverter = function (e) {
          return {
            decode: function (t) {
              if (t.key[0] !== e)
                throw new Error(
                  'Decode Error: could not decode redeemScript with key 0x' +
                    t.key.toString('hex')
                );
              return t.value;
            },
            encode: function (t) {
              return { key: Buffer.from([e]), value: t };
            },
            check: function (e) {
              return Buffer.isBuffer(e);
            },
            expected: 'Buffer',
            canAdd: function (e, t) {
              return !!e && !!t && void 0 === e.redeemScript;
            },
          };
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.makeConverter = function (e) {
          return {
            decode: function (t) {
              if (t.key[0] !== e)
                throw new Error(
                  'Decode Error: could not decode witnessScript with key 0x' +
                    t.key.toString('hex')
                );
              return t.value;
            },
            encode: function (t) {
              return { key: Buffer.from([e]), value: t };
            },
            check: function (e) {
              return Buffer.isBuffer(e);
            },
            expected: 'Buffer',
            canAdd: function (e, t) {
              return !!e && !!t && void 0 === e.witnessScript;
            },
          };
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(63),
        i = r(64);
      t.psbtToBuffer = function ({ globalMap: e, inputs: t, outputs: r }) {
        const { globalKeyVals: n, inputKeyVals: o, outputKeyVals: a } = s({
            globalMap: e,
            inputs: t,
            outputs: r,
          }),
          u = i.keyValsToBuffer(n),
          c = (e) =>
            0 === e.length ? [Buffer.from([0])] : e.map(i.keyValsToBuffer),
          f = c(o),
          l = c(a),
          d = Buffer.allocUnsafe(5);
        return (
          d.writeUIntBE(482972169471, 0, 5), Buffer.concat([d, u].concat(f, l))
        );
      };
      const o = (e, t) => e.key.compare(t.key);
      function a(e, t) {
        const r = new Set(),
          n = Object.entries(e).reduce((e, [n, i]) => {
            if ('unknownKeyVals' === n) return e;
            const o = t[n];
            if (void 0 === o) return e;
            const a = (Array.isArray(i) ? i : [i]).map(o.encode);
            return (
              a
                .map((e) => e.key.toString('hex'))
                .forEach((e) => {
                  if (r.has(e))
                    throw new Error('Serialize Error: Duplicate key: ' + e);
                  r.add(e);
                }),
              e.concat(a)
            );
          }, []),
          i = e.unknownKeyVals
            ? e.unknownKeyVals.filter((e) => !r.has(e.key.toString('hex')))
            : [];
        return n.concat(i).sort(o);
      }
      function s({ globalMap: e, inputs: t, outputs: r }) {
        return {
          globalKeyVals: a(e, n.globals),
          inputKeyVals: t.map((e) => a(e, n.inputs)),
          outputKeyVals: r.map((e) => a(e, n.outputs)),
        };
      }
      t.psbtToKeyVals = s;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(60),
        i = r(38),
        o = r(243),
        a = r(19),
        s = r(62),
        u = r(8),
        c = r(47),
        f = r(0),
        l = r(0),
        d = r(48),
        h = r(18),
        p = r(4),
        m = o.types,
        b = new Set([
          'p2pkh',
          'p2pk',
          'p2wpkh',
          'p2ms',
          'p2sh-p2pkh',
          'p2sh-p2pk',
          'p2sh-p2wpkh',
          'p2sh-p2ms',
          'p2wsh-p2pkh',
          'p2wsh-p2pk',
          'p2wsh-p2ms',
          'p2sh-p2wsh-p2pkh',
          'p2sh-p2wsh-p2pk',
          'p2sh-p2wsh-p2ms',
        ]);
      function g(e, t, r) {
        try {
          p(e, t);
        } catch (e) {
          throw new Error(r);
        }
      }
      class v {
        constructor(e = u.bitcoin, t = 2500) {
          (this.network = e),
            (this.maximumFeeRate = t),
            (this.__PREV_TX_SET = {}),
            (this.__INPUTS = []),
            (this.__TX = new d.Transaction()),
            (this.__TX.version = 2),
            (this.__USE_LOW_R = !1),
            console.warn(
              'Deprecation Warning: TransactionBuilder will be removed in the future. (v6.x.x or later) Please use the Psbt class instead. Examples of usage are available in the transactions-psbt.js integration test file on our Github. A high level explanation is available in the psbt.ts and psbt.js files as well.'
            );
        }
        static fromTransaction(e, t) {
          const r = new v(t);
          return (
            r.setVersion(e.version),
            r.setLockTime(e.locktime),
            e.outs.forEach((e) => {
              r.addOutput(e.script, e.value);
            }),
            e.ins.forEach((e) => {
              r.__addInputUnsafe(e.hash, e.index, {
                sequence: e.sequence,
                script: e.script,
                witness: e.witness,
              });
            }),
            r.__INPUTS.forEach((t, r) => {
              !(function (e, t, r) {
                if (e.redeemScriptType !== m.P2MS || !e.redeemScript) return;
                if (e.pubkeys.length === e.signatures.length) return;
                const n = e.signatures.concat();
                e.signatures = e.pubkeys.map((i) => {
                  const o = s.fromPublicKey(i);
                  let a;
                  return (
                    n.some((i, s) => {
                      if (!i) return !1;
                      const u = f.signature.decode(i),
                        c = t.hashForSignature(r, e.redeemScript, u.hashType);
                      return (
                        !!o.verify(c, u.signature) &&
                        ((n[s] = void 0), (a = i), !0)
                      );
                    }),
                    a
                  );
                });
              })(t, e, r);
            }),
            r
          );
        }
        setLowR(e) {
          return (
            p(p.maybe(p.Boolean), e),
            void 0 === e && (e = !0),
            (this.__USE_LOW_R = e),
            e
          );
        }
        setLockTime(e) {
          if (
            (p(h.UInt32, e),
            this.__INPUTS.some(
              (e) => !!e.signatures && e.signatures.some((e) => void 0 !== e)
            ))
          )
            throw new Error('No, this would invalidate signatures');
          this.__TX.locktime = e;
        }
        setVersion(e) {
          p(h.UInt32, e), (this.__TX.version = e);
        }
        addInput(e, t, r, n) {
          if (!this.__canModifyInputs())
            throw new Error('No, this would invalidate signatures');
          let o;
          if ('string' == typeof (a = e) || a instanceof String)
            e = i.reverseBuffer(Buffer.from(e, 'hex'));
          else if (
            (function (e) {
              return e instanceof d.Transaction;
            })(e)
          ) {
            const r = e.outs[t];
            (n = r.script), (o = r.value), (e = e.getHash(!1));
          }
          var a;
          return this.__addInputUnsafe(e, t, {
            sequence: r,
            prevOutScript: n,
            value: o,
          });
        }
        addOutput(e, t) {
          if (!this.__canModifyOutputs())
            throw new Error('No, this would invalidate signatures');
          return (
            'string' == typeof e && (e = n.toOutputScript(e, this.network)),
            this.__TX.addOutput(e, t)
          );
        }
        build() {
          return this.__build(!1);
        }
        buildIncomplete() {
          return this.__build(!0);
        }
        sign(e, t, r, n, i, o) {
          !(function ({
            input: e,
            ourPubKey: t,
            keyPair: r,
            signatureHash: n,
            hashType: i,
            useLowR: o,
          }) {
            let a = !1;
            for (const [s, u] of e.pubkeys.entries()) {
              if (!t.equals(u)) continue;
              if (e.signatures[s]) throw new Error('Signature already exists');
              if (33 !== t.length && e.hasWitness)
                throw new Error(
                  'BIP143 rejects uncompressed public keys in P2WPKH or P2WSH'
                );
              const c = r.sign(n, o);
              (e.signatures[s] = f.signature.encode(c, i)), (a = !0);
            }
            if (!a) throw new Error('Key pair cannot sign for this input');
          })(
            (function (e, t, r, n, i, o, a, s, u, l, v) {
              let _;
              if ('number' == typeof i)
                console.warn(
                  'DEPRECATED: TransactionBuilder sign method arguments will change in v6, please use the TxbSignArg interface'
                ),
                  (_ = i);
              else {
                if ('object' != typeof i)
                  throw new TypeError(
                    'TransactionBuilder sign first arg must be TxbSignArg or number'
                  );
                !(function (e, t) {
                  if (!b.has(t.prevOutScriptType))
                    throw new TypeError(
                      `Unknown prevOutScriptType "${t.prevOutScriptType}"`
                    );
                  g(
                    p.Number,
                    t.vin,
                    'sign must include vin parameter as Number (input index)'
                  ),
                    g(
                      h.Signer,
                      t.keyPair,
                      'sign must include keyPair parameter as Signer interface'
                    ),
                    g(
                      p.maybe(p.Number),
                      t.hashType,
                      'sign hashType parameter must be a number'
                    );
                  const r = (e[t.vin] || []).prevOutType,
                    n = t.prevOutScriptType;
                  switch (n) {
                    case 'p2pkh':
                      if (r && 'pubkeyhash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type p2pkh: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.value(void 0),
                          t.redeemScript,
                          n + ' requires NO redeemScript'
                        ),
                        g(
                          p.value(void 0),
                          t.witnessValue,
                          n + ' requires NO witnessValue'
                        );
                      break;
                    case 'p2pk':
                      if (r && 'pubkey' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type p2pk: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.value(void 0),
                          t.redeemScript,
                          n + ' requires NO redeemScript'
                        ),
                        g(
                          p.value(void 0),
                          t.witnessValue,
                          n + ' requires NO witnessValue'
                        );
                      break;
                    case 'p2wpkh':
                      if (r && 'witnesspubkeyhash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type p2wpkh: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.value(void 0),
                          t.redeemScript,
                          n + ' requires NO redeemScript'
                        ),
                        g(
                          h.Satoshi,
                          t.witnessValue,
                          n + ' requires witnessValue'
                        );
                      break;
                    case 'p2ms':
                      if (r && 'multisig' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type p2ms: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.value(void 0),
                          t.redeemScript,
                          n + ' requires NO redeemScript'
                        ),
                        g(
                          p.value(void 0),
                          t.witnessValue,
                          n + ' requires NO witnessValue'
                        );
                      break;
                    case 'p2sh-p2wpkh':
                      if (r && 'scripthash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type p2sh-p2wpkh: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.Buffer,
                          t.redeemScript,
                          n + ' requires redeemScript'
                        ),
                        g(
                          h.Satoshi,
                          t.witnessValue,
                          n + ' requires witnessValue'
                        );
                      break;
                    case 'p2sh-p2ms':
                    case 'p2sh-p2pk':
                    case 'p2sh-p2pkh':
                      if (r && 'scripthash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type ${n}: ${r}`
                        );
                      g(
                        p.value(void 0),
                        t.witnessScript,
                        n + ' requires NO witnessScript'
                      ),
                        g(
                          p.Buffer,
                          t.redeemScript,
                          n + ' requires redeemScript'
                        ),
                        g(
                          p.value(void 0),
                          t.witnessValue,
                          n + ' requires NO witnessValue'
                        );
                      break;
                    case 'p2wsh-p2ms':
                    case 'p2wsh-p2pk':
                    case 'p2wsh-p2pkh':
                      if (r && 'witnessscripthash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type ${n}: ${r}`
                        );
                      g(
                        p.Buffer,
                        t.witnessScript,
                        n + ' requires witnessScript'
                      ),
                        g(
                          p.value(void 0),
                          t.redeemScript,
                          n + ' requires NO redeemScript'
                        ),
                        g(
                          h.Satoshi,
                          t.witnessValue,
                          n + ' requires witnessValue'
                        );
                      break;
                    case 'p2sh-p2wsh-p2ms':
                    case 'p2sh-p2wsh-p2pk':
                    case 'p2sh-p2wsh-p2pkh':
                      if (r && 'scripthash' !== r)
                        throw new TypeError(
                          `input #${t.vin} is not of type ${n}: ${r}`
                        );
                      g(
                        p.Buffer,
                        t.witnessScript,
                        n + ' requires witnessScript'
                      ),
                        g(
                          p.Buffer,
                          t.redeemScript,
                          n + ' requires witnessScript'
                        ),
                        g(
                          h.Satoshi,
                          t.witnessValue,
                          n + ' requires witnessScript'
                        );
                  }
                })(t, i),
                  ({
                    vin: _,
                    keyPair: o,
                    redeemScript: a,
                    hashType: s,
                    witnessValue: u,
                    witnessScript: l,
                  } = i);
              }
              if (void 0 === o) throw new Error('sign requires keypair');
              if (o.network && o.network !== e)
                throw new TypeError('Inconsistent network');
              if (!t[_]) throw new Error('No input at index: ' + _);
              if (((s = s || d.Transaction.SIGHASH_ALL), r(s)))
                throw new Error('Transaction needs outputs');
              const S = t[_];
              if (void 0 !== S.redeemScript && a && !S.redeemScript.equals(a))
                throw new Error('Inconsistent redeemScript');
              const M = o.publicKey || (o.getPublicKey && o.getPublicKey());
              if (!w(S)) {
                if (void 0 !== u) {
                  if (void 0 !== S.value && S.value !== u)
                    throw new Error('Input did not match witnessValue');
                  p(h.Satoshi, u), (S.value = u);
                }
                if (!w(S)) {
                  const e = (function (e, t, r, n) {
                    if (r && n) {
                      const i = c.p2wsh({ redeem: { output: n } }),
                        o = c.p2wsh({ output: r }),
                        a = c.p2sh({ redeem: { output: r } }),
                        s = c.p2sh({ redeem: i });
                      if (!i.hash.equals(o.hash))
                        throw new Error(
                          'Witness script inconsistent with prevOutScript'
                        );
                      if (!a.hash.equals(s.hash))
                        throw new Error(
                          'Redeem script inconsistent with prevOutScript'
                        );
                      const u = y(i.redeem.output, t);
                      if (!u.pubkeys)
                        throw new Error(
                          u.type +
                            ' not supported as witnessScript (' +
                            f.toASM(n) +
                            ')'
                        );
                      e.signatures &&
                        e.signatures.some((e) => void 0 !== e) &&
                        (u.signatures = e.signatures);
                      const l = n;
                      if (u.type === m.P2WPKH)
                        throw new Error(
                          'P2SH(P2WSH(P2WPKH)) is a consensus failure'
                        );
                      return {
                        redeemScript: r,
                        redeemScriptType: m.P2WSH,
                        witnessScript: n,
                        witnessScriptType: u.type,
                        prevOutType: m.P2SH,
                        prevOutScript: a.output,
                        hasWitness: !0,
                        signScript: l,
                        signType: u.type,
                        pubkeys: u.pubkeys,
                        signatures: u.signatures,
                        maxSignatures: u.maxSignatures,
                      };
                    }
                    if (r) {
                      const n = c.p2sh({ redeem: { output: r } });
                      if (e.prevOutScript) {
                        let t;
                        try {
                          t = c.p2sh({ output: e.prevOutScript });
                        } catch (e) {
                          throw new Error('PrevOutScript must be P2SH');
                        }
                        if (!n.hash.equals(t.hash))
                          throw new Error(
                            'Redeem script inconsistent with prevOutScript'
                          );
                      }
                      const i = y(n.redeem.output, t);
                      if (!i.pubkeys)
                        throw new Error(
                          i.type +
                            ' not supported as redeemScript (' +
                            f.toASM(r) +
                            ')'
                        );
                      e.signatures &&
                        e.signatures.some((e) => void 0 !== e) &&
                        (i.signatures = e.signatures);
                      let o = r;
                      return (
                        i.type === m.P2WPKH &&
                          (o = c.p2pkh({ pubkey: i.pubkeys[0] }).output),
                        {
                          redeemScript: r,
                          redeemScriptType: i.type,
                          prevOutType: m.P2SH,
                          prevOutScript: n.output,
                          hasWitness: i.type === m.P2WPKH,
                          signScript: o,
                          signType: i.type,
                          pubkeys: i.pubkeys,
                          signatures: i.signatures,
                          maxSignatures: i.maxSignatures,
                        }
                      );
                    }
                    if (n) {
                      const r = c.p2wsh({ redeem: { output: n } });
                      if (e.prevOutScript) {
                        const t = c.p2wsh({ output: e.prevOutScript });
                        if (!r.hash.equals(t.hash))
                          throw new Error(
                            'Witness script inconsistent with prevOutScript'
                          );
                      }
                      const i = y(r.redeem.output, t);
                      if (!i.pubkeys)
                        throw new Error(
                          i.type +
                            ' not supported as witnessScript (' +
                            f.toASM(n) +
                            ')'
                        );
                      e.signatures &&
                        e.signatures.some((e) => void 0 !== e) &&
                        (i.signatures = e.signatures);
                      const o = n;
                      if (i.type === m.P2WPKH)
                        throw new Error('P2WSH(P2WPKH) is a consensus failure');
                      return {
                        witnessScript: n,
                        witnessScriptType: i.type,
                        prevOutType: m.P2WSH,
                        prevOutScript: r.output,
                        hasWitness: !0,
                        signScript: o,
                        signType: i.type,
                        pubkeys: i.pubkeys,
                        signatures: i.signatures,
                        maxSignatures: i.maxSignatures,
                      };
                    }
                    if (e.prevOutType && e.prevOutScript) {
                      if (e.prevOutType === m.P2SH)
                        throw new Error(
                          'PrevOutScript is ' +
                            e.prevOutType +
                            ', requires redeemScript'
                        );
                      if (e.prevOutType === m.P2WSH)
                        throw new Error(
                          'PrevOutScript is ' +
                            e.prevOutType +
                            ', requires witnessScript'
                        );
                      if (!e.prevOutScript)
                        throw new Error('PrevOutScript is missing');
                      const r = y(e.prevOutScript, t);
                      if (!r.pubkeys)
                        throw new Error(
                          r.type +
                            ' not supported (' +
                            f.toASM(e.prevOutScript) +
                            ')'
                        );
                      e.signatures &&
                        e.signatures.some((e) => void 0 !== e) &&
                        (r.signatures = e.signatures);
                      let n = e.prevOutScript;
                      return (
                        r.type === m.P2WPKH &&
                          (n = c.p2pkh({ pubkey: r.pubkeys[0] }).output),
                        {
                          prevOutType: r.type,
                          prevOutScript: e.prevOutScript,
                          hasWitness: r.type === m.P2WPKH,
                          signScript: n,
                          signType: r.type,
                          pubkeys: r.pubkeys,
                          signatures: r.signatures,
                          maxSignatures: r.maxSignatures,
                        }
                      );
                    }
                    const i = c.p2pkh({ pubkey: t }).output;
                    return {
                      prevOutType: m.P2PKH,
                      prevOutScript: i,
                      hasWitness: !1,
                      signScript: i,
                      signType: m.P2PKH,
                      pubkeys: [t],
                      signatures: [void 0],
                    };
                  })(S, M, a, l);
                  Object.assign(S, e);
                }
                if (!w(S)) throw Error(S.prevOutType + ' not supported');
              }
              let E;
              E = S.hasWitness
                ? n.hashForWitnessV0(_, S.signScript, S.value, s)
                : n.hashForSignature(_, S.signScript, s);
              return {
                input: S,
                ourPubKey: M,
                keyPair: o,
                signatureHash: E,
                hashType: s,
                useLowR: !!v,
              };
            })(
              this.network,
              this.__INPUTS,
              this.__needsOutputs.bind(this),
              this.__TX,
              e,
              t,
              r,
              n,
              i,
              o,
              this.__USE_LOW_R
            )
          );
        }
        __addInputUnsafe(e, t, r) {
          if (d.Transaction.isCoinbaseHash(e))
            throw new Error('coinbase inputs not supported');
          const n = e.toString('hex') + ':' + t;
          if (void 0 !== this.__PREV_TX_SET[n])
            throw new Error('Duplicate TxOut: ' + n);
          let i = {};
          if (
            (void 0 !== r.script &&
              (i = (function e(t, r, n, i) {
                if (0 === t.length && 0 === r.length) return {};
                if (!n) {
                  let e = o.input(t, !0),
                    i = o.witness(r, !0);
                  e === m.NONSTANDARD && (e = void 0),
                    i === m.NONSTANDARD && (i = void 0),
                    (n = e || i);
                }
                switch (n) {
                  case m.P2WPKH: {
                    const { output: e, pubkey: t, signature: n } = c.p2wpkh({
                      witness: r,
                    });
                    return {
                      prevOutScript: e,
                      prevOutType: m.P2WPKH,
                      pubkeys: [t],
                      signatures: [n],
                    };
                  }
                  case m.P2PKH: {
                    const { output: e, pubkey: r, signature: n } = c.p2pkh({
                      input: t,
                    });
                    return {
                      prevOutScript: e,
                      prevOutType: m.P2PKH,
                      pubkeys: [r],
                      signatures: [n],
                    };
                  }
                  case m.P2PK: {
                    const { signature: e } = c.p2pk({ input: t });
                    return {
                      prevOutType: m.P2PK,
                      pubkeys: [void 0],
                      signatures: [e],
                    };
                  }
                  case m.P2MS: {
                    const { m: e, pubkeys: r, signatures: n } = c.p2ms(
                      { input: t, output: i },
                      { allowIncomplete: !0 }
                    );
                    return {
                      prevOutType: m.P2MS,
                      pubkeys: r,
                      signatures: n,
                      maxSignatures: e,
                    };
                  }
                }
                if (n === m.P2SH) {
                  const { output: n, redeem: i } = c.p2sh({
                      input: t,
                      witness: r,
                    }),
                    a = o.output(i.output),
                    s = e(i.input, i.witness, a, i.output);
                  return s.prevOutType
                    ? {
                        prevOutScript: n,
                        prevOutType: m.P2SH,
                        redeemScript: i.output,
                        redeemScriptType: s.prevOutType,
                        witnessScript: s.witnessScript,
                        witnessScriptType: s.witnessScriptType,
                        pubkeys: s.pubkeys,
                        signatures: s.signatures,
                      }
                    : {};
                }
                if (n === m.P2WSH) {
                  const { output: n, redeem: i } = c.p2wsh({
                      input: t,
                      witness: r,
                    }),
                    a = o.output(i.output);
                  let s;
                  return (
                    (s =
                      a === m.P2WPKH
                        ? e(i.input, i.witness, a)
                        : e(f.compile(i.witness), [], a, i.output)),
                    s.prevOutType
                      ? {
                          prevOutScript: n,
                          prevOutType: m.P2WSH,
                          witnessScript: i.output,
                          witnessScriptType: s.prevOutType,
                          pubkeys: s.pubkeys,
                          signatures: s.signatures,
                        }
                      : {}
                  );
                }
                return { prevOutType: m.NONSTANDARD, prevOutScript: t };
              })(r.script, r.witness || [])),
            void 0 !== r.value && (i.value = r.value),
            !i.prevOutScript && r.prevOutScript)
          ) {
            let e;
            if (!i.pubkeys && !i.signatures) {
              const t = y(r.prevOutScript);
              t.pubkeys &&
                ((i.pubkeys = t.pubkeys), (i.signatures = t.signatures)),
                (e = t.type);
            }
            (i.prevOutScript = r.prevOutScript),
              (i.prevOutType = e || o.output(r.prevOutScript));
          }
          const a = this.__TX.addInput(e, t, r.sequence, r.scriptSig);
          return (this.__INPUTS[a] = i), (this.__PREV_TX_SET[n] = !0), a;
        }
        __build(e) {
          if (!e) {
            if (!this.__TX.ins.length)
              throw new Error('Transaction has no inputs');
            if (!this.__TX.outs.length)
              throw new Error('Transaction has no outputs');
          }
          const t = this.__TX.clone();
          if (
            (this.__INPUTS.forEach((r, n) => {
              if (!r.prevOutType && !e)
                throw new Error('Transaction is not complete');
              const i = (function e(t, r, n) {
                const i = r.pubkeys || [];
                let o = r.signatures || [];
                switch (t) {
                  case m.P2PKH:
                    if (0 === i.length) break;
                    if (0 === o.length) break;
                    return c.p2pkh({ pubkey: i[0], signature: o[0] });
                  case m.P2WPKH:
                    if (0 === i.length) break;
                    if (0 === o.length) break;
                    return c.p2wpkh({ pubkey: i[0], signature: o[0] });
                  case m.P2PK:
                    if (0 === i.length) break;
                    if (0 === o.length) break;
                    return c.p2pk({ signature: o[0] });
                  case m.P2MS: {
                    const e = r.maxSignatures;
                    o = n ? o.map((e) => e || l.OPS.OP_0) : o.filter((e) => e);
                    const t = !n || e === o.length;
                    return c.p2ms(
                      { m: e, pubkeys: i, signatures: o },
                      { allowIncomplete: n, validate: t }
                    );
                  }
                  case m.P2SH: {
                    const t = e(r.redeemScriptType, r, n);
                    if (!t) return;
                    return c.p2sh({
                      redeem: {
                        output: t.output || r.redeemScript,
                        input: t.input,
                        witness: t.witness,
                      },
                    });
                  }
                  case m.P2WSH: {
                    const t = e(r.witnessScriptType, r, n);
                    if (!t) return;
                    return c.p2wsh({
                      redeem: {
                        output: r.witnessScript,
                        input: t.input,
                        witness: t.witness,
                      },
                    });
                  }
                }
              })(r.prevOutType, r, e);
              if (i) t.setInputScript(n, i.input), t.setWitness(n, i.witness);
              else {
                if (!e && r.prevOutType === m.NONSTANDARD)
                  throw new Error('Unknown input type');
                if (!e) throw new Error('Not enough information');
              }
            }),
            !e && this.__overMaximumFees(t.virtualSize()))
          )
            throw new Error('Transaction has absurd fees');
          return t;
        }
        __canModifyInputs() {
          return this.__INPUTS.every(
            (e) =>
              !e.signatures ||
              e.signatures.every((e) => {
                if (!e) return !0;
                return 0 != (_(e) & d.Transaction.SIGHASH_ANYONECANPAY);
              })
          );
        }
        __needsOutputs(e) {
          return e === d.Transaction.SIGHASH_ALL
            ? 0 === this.__TX.outs.length
            : 0 === this.__TX.outs.length &&
                this.__INPUTS.some(
                  (e) =>
                    !!e.signatures &&
                    e.signatures.some((e) => {
                      if (!e) return !1;
                      return !(_(e) & d.Transaction.SIGHASH_NONE);
                    })
                );
        }
        __canModifyOutputs() {
          const e = this.__TX.ins.length,
            t = this.__TX.outs.length;
          return this.__INPUTS.every(
            (r) =>
              void 0 === r.signatures ||
              r.signatures.every((r) => {
                if (!r) return !0;
                const n = 31 & _(r);
                return (
                  n === d.Transaction.SIGHASH_NONE ||
                  (n === d.Transaction.SIGHASH_SINGLE && e <= t)
                );
              })
          );
        }
        __overMaximumFees(e) {
          return (
            (this.__INPUTS.reduce((e, t) => e + (t.value >>> 0), 0) -
              this.__TX.outs.reduce((e, t) => e + t.value, 0)) /
              e >
            this.maximumFeeRate
          );
        }
      }
      function y(e, t) {
        p(h.Buffer, e);
        const r = o.output(e);
        switch (r) {
          case m.P2PKH: {
            if (!t) return { type: r };
            const n = c.p2pkh({ output: e }).hash,
              i = a.hash160(t);
            return n.equals(i)
              ? { type: r, pubkeys: [t], signatures: [void 0] }
              : { type: r };
          }
          case m.P2WPKH: {
            if (!t) return { type: r };
            const n = c.p2wpkh({ output: e }).hash,
              i = a.hash160(t);
            return n.equals(i)
              ? { type: r, pubkeys: [t], signatures: [void 0] }
              : { type: r };
          }
          case m.P2PK:
            return {
              type: r,
              pubkeys: [c.p2pk({ output: e }).pubkey],
              signatures: [void 0],
            };
          case m.P2MS: {
            const t = c.p2ms({ output: e });
            return {
              type: r,
              pubkeys: t.pubkeys,
              signatures: t.pubkeys.map(() => {}),
              maxSignatures: t.m,
            };
          }
        }
        return { type: r };
      }
      function w(e) {
        return (
          void 0 !== e.signScript &&
          void 0 !== e.signType &&
          void 0 !== e.pubkeys &&
          void 0 !== e.signatures &&
          e.signatures.length === e.pubkeys.length &&
          e.pubkeys.length > 0 &&
          (!1 === e.hasWitness || void 0 !== e.value)
        );
      }
      function _(e) {
        return e.readUInt8(e.length - 1);
      }
      t.TransactionBuilder = v;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(65),
        o = r(246),
        a = r(66),
        s = r(67),
        u = r(251),
        c = r(254),
        f = r(256),
        l = r(258),
        d = {
          P2MS: 'multisig',
          NONSTANDARD: 'nonstandard',
          NULLDATA: 'nulldata',
          P2PK: 'pubkey',
          P2PKH: 'pubkeyhash',
          P2SH: 'scripthash',
          P2WPKH: 'witnesspubkeyhash',
          P2WSH: 'witnessscripthash',
          WITNESS_COMMITMENT: 'witnesscommitment',
        };
      (t.types = d),
        (t.output = function (e) {
          if (f.output.check(e)) return d.P2WPKH;
          if (l.output.check(e)) return d.P2WSH;
          if (s.output.check(e)) return d.P2PKH;
          if (u.output.check(e)) return d.P2SH;
          const t = n.decompile(e);
          if (!t) throw new TypeError('Invalid script');
          return i.output.check(t)
            ? d.P2MS
            : a.output.check(t)
            ? d.P2PK
            : c.output.check(t)
            ? d.WITNESS_COMMITMENT
            : o.output.check(t)
            ? d.NULLDATA
            : d.NONSTANDARD;
        }),
        (t.input = function (e, t) {
          const r = n.decompile(e);
          if (!r) throw new TypeError('Invalid script');
          return s.input.check(r)
            ? d.P2PKH
            : u.input.check(r, t)
            ? d.P2SH
            : i.input.check(r, t)
            ? d.P2MS
            : a.input.check(r)
            ? d.P2PK
            : d.NONSTANDARD;
        }),
        (t.witness = function (e, t) {
          const r = n.decompile(e);
          if (!r) throw new TypeError('Invalid script');
          return f.input.check(r)
            ? d.P2WPKH
            : l.input.check(r, t)
            ? d.P2WSH
            : d.NONSTANDARD;
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        return e === i.OPS.OP_0 || n.isCanonicalScriptSignature(e);
      }
      function a(e, t) {
        const r = n.decompile(e);
        return (
          !(r.length < 2) &&
          r[0] === i.OPS.OP_0 &&
          (t
            ? r.slice(1).every(o)
            : r.slice(1).every(n.isCanonicalScriptSignature))
        );
      }
      (t.check = a), (a.toJSON = () => 'multisig input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0),
        o = r(18),
        a = i.OPS.OP_RESERVED;
      function s(e, t) {
        const r = n.decompile(e);
        if (r.length < 4) return !1;
        if (r[r.length - 1] !== i.OPS.OP_CHECKMULTISIG) return !1;
        if (!o.Number(r[0])) return !1;
        if (!o.Number(r[r.length - 2])) return !1;
        const s = r[0] - a,
          u = r[r.length - 2] - a;
        if (s <= 0) return !1;
        if (u > 16) return !1;
        if (s > u) return !1;
        if (u !== r.length - 3) return !1;
        if (t) return !0;
        return r.slice(1, -2).every(n.isCanonicalPubKey);
      }
      (t.check = s), (s.toJSON = () => 'multi-sig output');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = n.OPS;
      function o(e) {
        const t = n.compile(e);
        return t.length > 1 && t[0] === i.OP_RETURN;
      }
      (t.check = o), (o.toJSON = () => 'null data output');
      const a = { check: o };
      t.output = a;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0);
      function i(e) {
        const t = n.decompile(e);
        return 1 === t.length && n.isCanonicalScriptSignature(t[0]);
      }
      (t.check = i), (i.toJSON = () => 'pubKey input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        const t = n.decompile(e);
        return (
          2 === t.length &&
          n.isCanonicalPubKey(t[0]) &&
          t[1] === i.OPS.OP_CHECKSIG
        );
      }
      (t.check = o), (o.toJSON = () => 'pubKey output');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0);
      function i(e) {
        const t = n.decompile(e);
        return (
          2 === t.length &&
          n.isCanonicalScriptSignature(t[0]) &&
          n.isCanonicalPubKey(t[1])
        );
      }
      (t.check = i), (i.toJSON = () => 'pubKeyHash input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        const t = n.compile(e);
        return (
          25 === t.length &&
          t[0] === i.OPS.OP_DUP &&
          t[1] === i.OPS.OP_HASH160 &&
          20 === t[2] &&
          t[23] === i.OPS.OP_EQUALVERIFY &&
          t[24] === i.OPS.OP_CHECKSIG
        );
      }
      (t.check = o), (o.toJSON = () => 'pubKeyHash output');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(252);
      t.input = n;
      const i = r(253);
      t.output = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(65),
        o = r(66),
        a = r(67),
        s = r(113),
        u = r(114);
      function c(e, t) {
        const r = n.decompile(e);
        if (r.length < 1) return !1;
        const c = r[r.length - 1];
        if (!Buffer.isBuffer(c)) return !1;
        const f = n.decompile(n.compile(r.slice(0, -1))),
          l = n.decompile(c);
        return (
          !!l &&
          !!n.isPushOnly(f) &&
          (1 === r.length
            ? u.check(l) || s.check(l)
            : !(!a.input.check(f) || !a.output.check(l)) ||
              !(!i.input.check(f, t) || !i.output.check(l)) ||
              !(!o.input.check(f) || !o.output.check(l)))
        );
      }
      (t.check = c), (c.toJSON = () => 'scriptHash input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0);
      function o(e) {
        const t = n.compile(e);
        return (
          23 === t.length &&
          t[0] === i.OPS.OP_HASH160 &&
          20 === t[1] &&
          t[22] === i.OPS.OP_EQUAL
        );
      }
      (t.check = o), (o.toJSON = () => 'scriptHash output');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(255);
      t.output = n;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(0),
        o = r(18),
        a = r(4),
        s = Buffer.from('aa21a9ed', 'hex');
      function u(e) {
        const t = n.compile(e);
        return (
          t.length > 37 &&
          t[0] === i.OPS.OP_RETURN &&
          36 === t[1] &&
          t.slice(2, 6).equals(s)
        );
      }
      (t.check = u),
        (u.toJSON = () => 'Witness commitment output'),
        (t.encode = function (e) {
          a(o.Hash256bit, e);
          const t = Buffer.allocUnsafe(36);
          return s.copy(t, 0), e.copy(t, 4), n.compile([i.OPS.OP_RETURN, t]);
        }),
        (t.decode = function (e) {
          return a(u, e), n.decompile(e)[1].slice(4, 36);
        });
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(257);
      t.input = n;
      const i = r(113);
      t.output = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0);
      function i(e) {
        const t = n.decompile(e);
        return (
          2 === t.length &&
          n.isCanonicalScriptSignature(t[0]) &&
          ((r = t[1]), n.isCanonicalPubKey(r) && 33 === r.length)
        );
        var r;
      }
      (t.check = i), (i.toJSON = () => 'witnessPubKeyHash input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(259);
      t.input = n;
      const i = r(114);
      t.output = i;
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(0),
        i = r(4),
        o = r(65),
        a = r(66),
        s = r(67);
      function u(e, t) {
        if ((i(i.Array, e), e.length < 1)) return !1;
        const r = e[e.length - 1];
        if (!Buffer.isBuffer(r)) return !1;
        const u = n.decompile(r);
        if (!u || 0 === u.length) return !1;
        const c = n.compile(e.slice(0, -1));
        return (
          !(!s.input.check(c) || !s.output.check(u)) ||
          !(!o.input.check(c, t) || !o.output.check(u)) ||
          !(!a.input.check(c) || !a.output.check(u))
        );
      }
      (t.check = u), (u.toJSON = () => 'witnessScriptHash input');
    },
    function (e, t, r) {
      'use strict';
      Object.defineProperty(t, '__esModule', { value: !0 });
      const n = r(46),
        i = r(261),
        o = r(109),
        a = r(117);
      let s = a._default;
      const u =
        'A wordlist is required but a default could not be found.\nPlease explicitly pass a 2048 word array explicitly.';
      function c(e, t, r) {
        for (; e.length < r; ) e = t + e;
        return e;
      }
      function f(e) {
        return parseInt(e, 2);
      }
      function l(e) {
        return e.map((e) => c(e.toString(2), '0', 8)).join('');
      }
      function d(e) {
        const t = (8 * e.length) / 32;
        return l([...n('sha256').update(e).digest()]).slice(0, t);
      }
      function h(e) {
        return 'mnemonic' + (e || '');
      }
      function p(e, t) {
        if (!(t = t || s)) throw new Error(u);
        const r = (e || '').normalize('NFKD').split(' ');
        if (r.length % 3 != 0) throw new Error('Invalid mnemonic');
        const n = r
            .map((e) => {
              const r = t.indexOf(e);
              if (-1 === r) throw new Error('Invalid mnemonic');
              return c(r.toString(2), '0', 11);
            })
            .join(''),
          i = 32 * Math.floor(n.length / 33),
          o = n.slice(0, i),
          a = n.slice(i),
          l = o.match(/(.{1,8})/g).map(f);
        if (l.length < 16) throw new Error('Invalid entropy');
        if (l.length > 32) throw new Error('Invalid entropy');
        if (l.length % 4 != 0) throw new Error('Invalid entropy');
        const h = Buffer.from(l);
        if (d(h) !== a) throw new Error('Invalid mnemonic checksum');
        return h.toString('hex');
      }
      function m(e, t) {
        if ((Buffer.isBuffer(e) || (e = Buffer.from(e, 'hex')), !(t = t || s)))
          throw new Error(u);
        if (e.length < 16) throw new TypeError('Invalid entropy');
        if (e.length > 32) throw new TypeError('Invalid entropy');
        if (e.length % 4 != 0) throw new TypeError('Invalid entropy');
        const r = (l([...e]) + d(e)).match(/(.{1,11})/g).map((e) => {
          const r = f(e);
          return t[r];
        });
        return 'あいこくしん' === t[0] ? r.join('　') : r.join(' ');
      }
      (t.mnemonicToSeedSync = function (e, t) {
        const r = Buffer.from((e || '').normalize('NFKD'), 'utf8'),
          n = Buffer.from(h((t || '').normalize('NFKD')), 'utf8');
        return i.pbkdf2Sync(r, n, 2048, 64, 'sha512');
      }),
        (t.mnemonicToSeed = function (e, t) {
          return new Promise((r, n) => {
            try {
              const o = Buffer.from((e || '').normalize('NFKD'), 'utf8'),
                a = Buffer.from(h((t || '').normalize('NFKD')), 'utf8');
              i.pbkdf2(o, a, 2048, 64, 'sha512', (e, t) => (e ? n(e) : r(t)));
            } catch (e) {
              return n(e);
            }
          });
        }),
        (t.mnemonicToEntropy = p),
        (t.entropyToMnemonic = m),
        (t.generateMnemonic = function (e, t, r) {
          if ((e = e || 128) % 32 != 0) throw new TypeError('Invalid entropy');
          return m((t = t || o)(e / 8), r);
        }),
        (t.validateMnemonic = function (e, t) {
          try {
            p(e, t);
          } catch (e) {
            return !1;
          }
          return !0;
        }),
        (t.setDefaultWordlist = function (e) {
          const t = a.wordlists[e];
          if (!t)
            throw new Error('Could not find wordlist for language "' + e + '"');
          s = t;
        }),
        (t.getDefaultWordlist = function () {
          if (!s) throw new Error('No Default Wordlist set');
          return Object.keys(a.wordlists).filter(
            (e) =>
              'JA' !== e &&
              'EN' !== e &&
              a.wordlists[e].every((e, t) => e === s[t])
          )[0];
        });
      var b = r(117);
      t.wordlists = b.wordlists;
    },
    function (e, t, r) {
      var n = r(68),
        i = r(2);
      i.pbkdf2Sync && -1 !== i.pbkdf2Sync.toString().indexOf('keylen, digest')
        ? ((t.pbkdf2Sync = function (e, t, r, o, a) {
            return (
              n(e, t, r, o), (a = a || 'sha1'), i.pbkdf2Sync(e, t, r, o, a)
            );
          }),
          (t.pbkdf2 = function (e, t, r, o, a, s) {
            if (
              (n(e, t, r, o),
              'function' == typeof a && ((s = a), (a = 'sha1')),
              'function' != typeof s)
            )
              throw new Error('No callback provided to pbkdf2');
            return i.pbkdf2(e, t, r, o, a, s);
          }))
        : ((t.pbkdf2Sync = r(115)), (t.pbkdf2 = r(262)));
    },
    function (e, t, r) {
      var n,
        i = r(68),
        o = r(116),
        a = r(115),
        s = r(16).Buffer,
        u = global.crypto && global.crypto.subtle,
        c = {
          sha: 'SHA-1',
          'sha-1': 'SHA-1',
          sha1: 'SHA-1',
          sha256: 'SHA-256',
          'sha-256': 'SHA-256',
          sha384: 'SHA-384',
          'sha-384': 'SHA-384',
          'sha-512': 'SHA-512',
          sha512: 'SHA-512',
        },
        f = [];
      function l(e, t, r, n, i) {
        return u
          .importKey('raw', e, { name: 'PBKDF2' }, !1, ['deriveBits'])
          .then(function (e) {
            return u.deriveBits(
              { name: 'PBKDF2', salt: t, iterations: r, hash: { name: i } },
              e,
              n << 3
            );
          })
          .then(function (e) {
            return s.from(e);
          });
      }
      e.exports = function (e, t, r, d, h, p) {
        'function' == typeof h && ((p = h), (h = void 0));
        var m = c[(h = h || 'sha1').toLowerCase()];
        if (!m || 'function' != typeof global.Promise)
          return process.nextTick(function () {
            var n;
            try {
              n = a(e, t, r, d, h);
            } catch (e) {
              return p(e);
            }
            p(null, n);
          });
        if ((i(e, t, r, d), 'function' != typeof p))
          throw new Error('No callback provided to pbkdf2');
        s.isBuffer(e) || (e = s.from(e, o)),
          s.isBuffer(t) || (t = s.from(t, o)),
          (function (e, t) {
            e.then(
              function (e) {
                process.nextTick(function () {
                  t(null, e);
                });
              },
              function (e) {
                process.nextTick(function () {
                  t(e);
                });
              }
            );
          })(
            (function (e) {
              if (global.process && !global.process.browser)
                return Promise.resolve(!1);
              if (!u || !u.importKey || !u.deriveBits)
                return Promise.resolve(!1);
              if (void 0 !== f[e]) return f[e];
              var t = l((n = n || s.alloc(8)), n, 10, 128, e)
                .then(function () {
                  return !0;
                })
                .catch(function () {
                  return !1;
                });
              return (f[e] = t), t;
            })(m).then(function (n) {
              return n ? l(e, t, r, d, m) : a(e, t, r, d, h);
            }),
            p
          );
      };
    },
    function (e) {
      e.exports = JSON.parse(
        '["的","一","是","在","不","了","有","和","人","这","中","大","为","上","个","国","我","以","要","他","时","来","用","们","生","到","作","地","于","出","就","分","对","成","会","可","主","发","年","动","同","工","也","能","下","过","子","说","产","种","面","而","方","后","多","定","行","学","法","所","民","得","经","十","三","之","进","着","等","部","度","家","电","力","里","如","水","化","高","自","二","理","起","小","物","现","实","加","量","都","两","体","制","机","当","使","点","从","业","本","去","把","性","好","应","开","它","合","还","因","由","其","些","然","前","外","天","政","四","日","那","社","义","事","平","形","相","全","表","间","样","与","关","各","重","新","线","内","数","正","心","反","你","明","看","原","又","么","利","比","或","但","质","气","第","向","道","命","此","变","条","只","没","结","解","问","意","建","月","公","无","系","军","很","情","者","最","立","代","想","已","通","并","提","直","题","党","程","展","五","果","料","象","员","革","位","入","常","文","总","次","品","式","活","设","及","管","特","件","长","求","老","头","基","资","边","流","路","级","少","图","山","统","接","知","较","将","组","见","计","别","她","手","角","期","根","论","运","农","指","几","九","区","强","放","决","西","被","干","做","必","战","先","回","则","任","取","据","处","队","南","给","色","光","门","即","保","治","北","造","百","规","热","领","七","海","口","东","导","器","压","志","世","金","增","争","济","阶","油","思","术","极","交","受","联","什","认","六","共","权","收","证","改","清","美","再","采","转","更","单","风","切","打","白","教","速","花","带","安","场","身","车","例","真","务","具","万","每","目","至","达","走","积","示","议","声","报","斗","完","类","八","离","华","名","确","才","科","张","信","马","节","话","米","整","空","元","况","今","集","温","传","土","许","步","群","广","石","记","需","段","研","界","拉","林","律","叫","且","究","观","越","织","装","影","算","低","持","音","众","书","布","复","容","儿","须","际","商","非","验","连","断","深","难","近","矿","千","周","委","素","技","备","半","办","青","省","列","习","响","约","支","般","史","感","劳","便","团","往","酸","历","市","克","何","除","消","构","府","称","太","准","精","值","号","率","族","维","划","选","标","写","存","候","毛","亲","快","效","斯","院","查","江","型","眼","王","按","格","养","易","置","派","层","片","始","却","专","状","育","厂","京","识","适","属","圆","包","火","住","调","满","县","局","照","参","红","细","引","听","该","铁","价","严","首","底","液","官","德","随","病","苏","失","尔","死","讲","配","女","黄","推","显","谈","罪","神","艺","呢","席","含","企","望","密","批","营","项","防","举","球","英","氧","势","告","李","台","落","木","帮","轮","破","亚","师","围","注","远","字","材","排","供","河","态","封","另","施","减","树","溶","怎","止","案","言","士","均","武","固","叶","鱼","波","视","仅","费","紧","爱","左","章","早","朝","害","续","轻","服","试","食","充","兵","源","判","护","司","足","某","练","差","致","板","田","降","黑","犯","负","击","范","继","兴","似","余","坚","曲","输","修","故","城","夫","够","送","笔","船","占","右","财","吃","富","春","职","觉","汉","画","功","巴","跟","虽","杂","飞","检","吸","助","升","阳","互","初","创","抗","考","投","坏","策","古","径","换","未","跑","留","钢","曾","端","责","站","简","述","钱","副","尽","帝","射","草","冲","承","独","令","限","阿","宣","环","双","请","超","微","让","控","州","良","轴","找","否","纪","益","依","优","顶","础","载","倒","房","突","坐","粉","敌","略","客","袁","冷","胜","绝","析","块","剂","测","丝","协","诉","念","陈","仍","罗","盐","友","洋","错","苦","夜","刑","移","频","逐","靠","混","母","短","皮","终","聚","汽","村","云","哪","既","距","卫","停","烈","央","察","烧","迅","境","若","印","洲","刻","括","激","孔","搞","甚","室","待","核","校","散","侵","吧","甲","游","久","菜","味","旧","模","湖","货","损","预","阻","毫","普","稳","乙","妈","植","息","扩","银","语","挥","酒","守","拿","序","纸","医","缺","雨","吗","针","刘","啊","急","唱","误","训","愿","审","附","获","茶","鲜","粮","斤","孩","脱","硫","肥","善","龙","演","父","渐","血","欢","械","掌","歌","沙","刚","攻","谓","盾","讨","晚","粒","乱","燃","矛","乎","杀","药","宁","鲁","贵","钟","煤","读","班","伯","香","介","迫","句","丰","培","握","兰","担","弦","蛋","沉","假","穿","执","答","乐","谁","顺","烟","缩","征","脸","喜","松","脚","困","异","免","背","星","福","买","染","井","概","慢","怕","磁","倍","祖","皇","促","静","补","评","翻","肉","践","尼","衣","宽","扬","棉","希","伤","操","垂","秋","宜","氢","套","督","振","架","亮","末","宪","庆","编","牛","触","映","雷","销","诗","座","居","抓","裂","胞","呼","娘","景","威","绿","晶","厚","盟","衡","鸡","孙","延","危","胶","屋","乡","临","陆","顾","掉","呀","灯","岁","措","束","耐","剧","玉","赵","跳","哥","季","课","凯","胡","额","款","绍","卷","齐","伟","蒸","殖","永","宗","苗","川","炉","岩","弱","零","杨","奏","沿","露","杆","探","滑","镇","饭","浓","航","怀","赶","库","夺","伊","灵","税","途","灭","赛","归","召","鼓","播","盘","裁","险","康","唯","录","菌","纯","借","糖","盖","横","符","私","努","堂","域","枪","润","幅","哈","竟","熟","虫","泽","脑","壤","碳","欧","遍","侧","寨","敢","彻","虑","斜","薄","庭","纳","弹","饲","伸","折","麦","湿","暗","荷","瓦","塞","床","筑","恶","户","访","塔","奇","透","梁","刀","旋","迹","卡","氯","遇","份","毒","泥","退","洗","摆","灰","彩","卖","耗","夏","择","忙","铜","献","硬","予","繁","圈","雪","函","亦","抽","篇","阵","阴","丁","尺","追","堆","雄","迎","泛","爸","楼","避","谋","吨","野","猪","旗","累","偏","典","馆","索","秦","脂","潮","爷","豆","忽","托","惊","塑","遗","愈","朱","替","纤","粗","倾","尚","痛","楚","谢","奋","购","磨","君","池","旁","碎","骨","监","捕","弟","暴","割","贯","殊","释","词","亡","壁","顿","宝","午","尘","闻","揭","炮","残","冬","桥","妇","警","综","招","吴","付","浮","遭","徐","您","摇","谷","赞","箱","隔","订","男","吹","园","纷","唐","败","宋","玻","巨","耕","坦","荣","闭","湾","键","凡","驻","锅","救","恩","剥","凝","碱","齿","截","炼","麻","纺","禁","废","盛","版","缓","净","睛","昌","婚","涉","筒","嘴","插","岸","朗","庄","街","藏","姑","贸","腐","奴","啦","惯","乘","伙","恢","匀","纱","扎","辩","耳","彪","臣","亿","璃","抵","脉","秀","萨","俄","网","舞","店","喷","纵","寸","汗","挂","洪","贺","闪","柬","爆","烯","津","稻","墙","软","勇","像","滚","厘","蒙","芳","肯","坡","柱","荡","腿","仪","旅","尾","轧","冰","贡","登","黎","削","钻","勒","逃","障","氨","郭","峰","币","港","伏","轨","亩","毕","擦","莫","刺","浪","秘","援","株","健","售","股","岛","甘","泡","睡","童","铸","汤","阀","休","汇","舍","牧","绕","炸","哲","磷","绩","朋","淡","尖","启","陷","柴","呈","徒","颜","泪","稍","忘","泵","蓝","拖","洞","授","镜","辛","壮","锋","贫","虚","弯","摩","泰","幼","廷","尊","窗","纲","弄","隶","疑","氏","宫","姐","震","瑞","怪","尤","琴","循","描","膜","违","夹","腰","缘","珠","穷","森","枝","竹","沟","催","绳","忆","邦","剩","幸","浆","栏","拥","牙","贮","礼","滤","钠","纹","罢","拍","咱","喊","袖","埃","勤","罚","焦","潜","伍","墨","欲","缝","姓","刊","饱","仿","奖","铝","鬼","丽","跨","默","挖","链","扫","喝","袋","炭","污","幕","诸","弧","励","梅","奶","洁","灾","舟","鉴","苯","讼","抱","毁","懂","寒","智","埔","寄","届","跃","渡","挑","丹","艰","贝","碰","拔","爹","戴","码","梦","芽","熔","赤","渔","哭","敬","颗","奔","铅","仲","虎","稀","妹","乏","珍","申","桌","遵","允","隆","螺","仓","魏","锐","晓","氮","兼","隐","碍","赫","拨","忠","肃","缸","牵","抢","博","巧","壳","兄","杜","讯","诚","碧","祥","柯","页","巡","矩","悲","灌","龄","伦","票","寻","桂","铺","圣","恐","恰","郑","趣","抬","荒","腾","贴","柔","滴","猛","阔","辆","妻","填","撤","储","签","闹","扰","紫","砂","递","戏","吊","陶","伐","喂","疗","瓶","婆","抚","臂","摸","忍","虾","蜡","邻","胸","巩","挤","偶","弃","槽","劲","乳","邓","吉","仁","烂","砖","租","乌","舰","伴","瓜","浅","丙","暂","燥","橡","柳","迷","暖","牌","秧","胆","详","簧","踏","瓷","谱","呆","宾","糊","洛","辉","愤","竞","隙","怒","粘","乃","绪","肩","籍","敏","涂","熙","皆","侦","悬","掘","享","纠","醒","狂","锁","淀","恨","牲","霸","爬","赏","逆","玩","陵","祝","秒","浙","貌","役","彼","悉","鸭","趋","凤","晨","畜","辈","秩","卵","署","梯","炎","滩","棋","驱","筛","峡","冒","啥","寿","译","浸","泉","帽","迟","硅","疆","贷","漏","稿","冠","嫩","胁","芯","牢","叛","蚀","奥","鸣","岭","羊","凭","串","塘","绘","酵","融","盆","锡","庙","筹","冻","辅","摄","袭","筋","拒","僚","旱","钾","鸟","漆","沈","眉","疏","添","棒","穗","硝","韩","逼","扭","侨","凉","挺","碗","栽","炒","杯","患","馏","劝","豪","辽","勃","鸿","旦","吏","拜","狗","埋","辊","掩","饮","搬","骂","辞","勾","扣","估","蒋","绒","雾","丈","朵","姆","拟","宇","辑","陕","雕","偿","蓄","崇","剪","倡","厅","咬","驶","薯","刷","斥","番","赋","奉","佛","浇","漫","曼","扇","钙","桃","扶","仔","返","俗","亏","腔","鞋","棱","覆","框","悄","叔","撞","骗","勘","旺","沸","孤","吐","孟","渠","屈","疾","妙","惜","仰","狠","胀","谐","抛","霉","桑","岗","嘛","衰","盗","渗","脏","赖","涌","甜","曹","阅","肌","哩","厉","烃","纬","毅","昨","伪","症","煮","叹","钉","搭","茎","笼","酷","偷","弓","锥","恒","杰","坑","鼻","翼","纶","叙","狱","逮","罐","络","棚","抑","膨","蔬","寺","骤","穆","冶","枯","册","尸","凸","绅","坯","牺","焰","轰","欣","晋","瘦","御","锭","锦","丧","旬","锻","垄","搜","扑","邀","亭","酯","迈","舒","脆","酶","闲","忧","酚","顽","羽","涨","卸","仗","陪","辟","惩","杭","姚","肚","捉","飘","漂","昆","欺","吾","郎","烷","汁","呵","饰","萧","雅","邮","迁","燕","撒","姻","赴","宴","烦","债","帐","斑","铃","旨","醇","董","饼","雏","姿","拌","傅","腹","妥","揉","贤","拆","歪","葡","胺","丢","浩","徽","昂","垫","挡","览","贪","慰","缴","汪","慌","冯","诺","姜","谊","凶","劣","诬","耀","昏","躺","盈","骑","乔","溪","丛","卢","抹","闷","咨","刮","驾","缆","悟","摘","铒","掷","颇","幻","柄","惠","惨","佳","仇","腊","窝","涤","剑","瞧","堡","泼","葱","罩","霍","捞","胎","苍","滨","俩","捅","湘","砍","霞","邵","萄","疯","淮","遂","熊","粪","烘","宿","档","戈","驳","嫂","裕","徙","箭","捐","肠","撑","晒","辨","殿","莲","摊","搅","酱","屏","疫","哀","蔡","堵","沫","皱","畅","叠","阁","莱","敲","辖","钩","痕","坝","巷","饿","祸","丘","玄","溜","曰","逻","彭","尝","卿","妨","艇","吞","韦","怨","矮","歇"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["的","一","是","在","不","了","有","和","人","這","中","大","為","上","個","國","我","以","要","他","時","來","用","們","生","到","作","地","於","出","就","分","對","成","會","可","主","發","年","動","同","工","也","能","下","過","子","說","產","種","面","而","方","後","多","定","行","學","法","所","民","得","經","十","三","之","進","著","等","部","度","家","電","力","裡","如","水","化","高","自","二","理","起","小","物","現","實","加","量","都","兩","體","制","機","當","使","點","從","業","本","去","把","性","好","應","開","它","合","還","因","由","其","些","然","前","外","天","政","四","日","那","社","義","事","平","形","相","全","表","間","樣","與","關","各","重","新","線","內","數","正","心","反","你","明","看","原","又","麼","利","比","或","但","質","氣","第","向","道","命","此","變","條","只","沒","結","解","問","意","建","月","公","無","系","軍","很","情","者","最","立","代","想","已","通","並","提","直","題","黨","程","展","五","果","料","象","員","革","位","入","常","文","總","次","品","式","活","設","及","管","特","件","長","求","老","頭","基","資","邊","流","路","級","少","圖","山","統","接","知","較","將","組","見","計","別","她","手","角","期","根","論","運","農","指","幾","九","區","強","放","決","西","被","幹","做","必","戰","先","回","則","任","取","據","處","隊","南","給","色","光","門","即","保","治","北","造","百","規","熱","領","七","海","口","東","導","器","壓","志","世","金","增","爭","濟","階","油","思","術","極","交","受","聯","什","認","六","共","權","收","證","改","清","美","再","採","轉","更","單","風","切","打","白","教","速","花","帶","安","場","身","車","例","真","務","具","萬","每","目","至","達","走","積","示","議","聲","報","鬥","完","類","八","離","華","名","確","才","科","張","信","馬","節","話","米","整","空","元","況","今","集","溫","傳","土","許","步","群","廣","石","記","需","段","研","界","拉","林","律","叫","且","究","觀","越","織","裝","影","算","低","持","音","眾","書","布","复","容","兒","須","際","商","非","驗","連","斷","深","難","近","礦","千","週","委","素","技","備","半","辦","青","省","列","習","響","約","支","般","史","感","勞","便","團","往","酸","歷","市","克","何","除","消","構","府","稱","太","準","精","值","號","率","族","維","劃","選","標","寫","存","候","毛","親","快","效","斯","院","查","江","型","眼","王","按","格","養","易","置","派","層","片","始","卻","專","狀","育","廠","京","識","適","屬","圓","包","火","住","調","滿","縣","局","照","參","紅","細","引","聽","該","鐵","價","嚴","首","底","液","官","德","隨","病","蘇","失","爾","死","講","配","女","黃","推","顯","談","罪","神","藝","呢","席","含","企","望","密","批","營","項","防","舉","球","英","氧","勢","告","李","台","落","木","幫","輪","破","亞","師","圍","注","遠","字","材","排","供","河","態","封","另","施","減","樹","溶","怎","止","案","言","士","均","武","固","葉","魚","波","視","僅","費","緊","愛","左","章","早","朝","害","續","輕","服","試","食","充","兵","源","判","護","司","足","某","練","差","致","板","田","降","黑","犯","負","擊","范","繼","興","似","餘","堅","曲","輸","修","故","城","夫","夠","送","筆","船","佔","右","財","吃","富","春","職","覺","漢","畫","功","巴","跟","雖","雜","飛","檢","吸","助","昇","陽","互","初","創","抗","考","投","壞","策","古","徑","換","未","跑","留","鋼","曾","端","責","站","簡","述","錢","副","盡","帝","射","草","衝","承","獨","令","限","阿","宣","環","雙","請","超","微","讓","控","州","良","軸","找","否","紀","益","依","優","頂","礎","載","倒","房","突","坐","粉","敵","略","客","袁","冷","勝","絕","析","塊","劑","測","絲","協","訴","念","陳","仍","羅","鹽","友","洋","錯","苦","夜","刑","移","頻","逐","靠","混","母","短","皮","終","聚","汽","村","雲","哪","既","距","衛","停","烈","央","察","燒","迅","境","若","印","洲","刻","括","激","孔","搞","甚","室","待","核","校","散","侵","吧","甲","遊","久","菜","味","舊","模","湖","貨","損","預","阻","毫","普","穩","乙","媽","植","息","擴","銀","語","揮","酒","守","拿","序","紙","醫","缺","雨","嗎","針","劉","啊","急","唱","誤","訓","願","審","附","獲","茶","鮮","糧","斤","孩","脫","硫","肥","善","龍","演","父","漸","血","歡","械","掌","歌","沙","剛","攻","謂","盾","討","晚","粒","亂","燃","矛","乎","殺","藥","寧","魯","貴","鐘","煤","讀","班","伯","香","介","迫","句","豐","培","握","蘭","擔","弦","蛋","沉","假","穿","執","答","樂","誰","順","煙","縮","徵","臉","喜","松","腳","困","異","免","背","星","福","買","染","井","概","慢","怕","磁","倍","祖","皇","促","靜","補","評","翻","肉","踐","尼","衣","寬","揚","棉","希","傷","操","垂","秋","宜","氫","套","督","振","架","亮","末","憲","慶","編","牛","觸","映","雷","銷","詩","座","居","抓","裂","胞","呼","娘","景","威","綠","晶","厚","盟","衡","雞","孫","延","危","膠","屋","鄉","臨","陸","顧","掉","呀","燈","歲","措","束","耐","劇","玉","趙","跳","哥","季","課","凱","胡","額","款","紹","卷","齊","偉","蒸","殖","永","宗","苗","川","爐","岩","弱","零","楊","奏","沿","露","桿","探","滑","鎮","飯","濃","航","懷","趕","庫","奪","伊","靈","稅","途","滅","賽","歸","召","鼓","播","盤","裁","險","康","唯","錄","菌","純","借","糖","蓋","橫","符","私","努","堂","域","槍","潤","幅","哈","竟","熟","蟲","澤","腦","壤","碳","歐","遍","側","寨","敢","徹","慮","斜","薄","庭","納","彈","飼","伸","折","麥","濕","暗","荷","瓦","塞","床","築","惡","戶","訪","塔","奇","透","梁","刀","旋","跡","卡","氯","遇","份","毒","泥","退","洗","擺","灰","彩","賣","耗","夏","擇","忙","銅","獻","硬","予","繁","圈","雪","函","亦","抽","篇","陣","陰","丁","尺","追","堆","雄","迎","泛","爸","樓","避","謀","噸","野","豬","旗","累","偏","典","館","索","秦","脂","潮","爺","豆","忽","托","驚","塑","遺","愈","朱","替","纖","粗","傾","尚","痛","楚","謝","奮","購","磨","君","池","旁","碎","骨","監","捕","弟","暴","割","貫","殊","釋","詞","亡","壁","頓","寶","午","塵","聞","揭","炮","殘","冬","橋","婦","警","綜","招","吳","付","浮","遭","徐","您","搖","谷","贊","箱","隔","訂","男","吹","園","紛","唐","敗","宋","玻","巨","耕","坦","榮","閉","灣","鍵","凡","駐","鍋","救","恩","剝","凝","鹼","齒","截","煉","麻","紡","禁","廢","盛","版","緩","淨","睛","昌","婚","涉","筒","嘴","插","岸","朗","莊","街","藏","姑","貿","腐","奴","啦","慣","乘","夥","恢","勻","紗","扎","辯","耳","彪","臣","億","璃","抵","脈","秀","薩","俄","網","舞","店","噴","縱","寸","汗","掛","洪","賀","閃","柬","爆","烯","津","稻","牆","軟","勇","像","滾","厘","蒙","芳","肯","坡","柱","盪","腿","儀","旅","尾","軋","冰","貢","登","黎","削","鑽","勒","逃","障","氨","郭","峰","幣","港","伏","軌","畝","畢","擦","莫","刺","浪","秘","援","株","健","售","股","島","甘","泡","睡","童","鑄","湯","閥","休","匯","舍","牧","繞","炸","哲","磷","績","朋","淡","尖","啟","陷","柴","呈","徒","顏","淚","稍","忘","泵","藍","拖","洞","授","鏡","辛","壯","鋒","貧","虛","彎","摩","泰","幼","廷","尊","窗","綱","弄","隸","疑","氏","宮","姐","震","瑞","怪","尤","琴","循","描","膜","違","夾","腰","緣","珠","窮","森","枝","竹","溝","催","繩","憶","邦","剩","幸","漿","欄","擁","牙","貯","禮","濾","鈉","紋","罷","拍","咱","喊","袖","埃","勤","罰","焦","潛","伍","墨","欲","縫","姓","刊","飽","仿","獎","鋁","鬼","麗","跨","默","挖","鏈","掃","喝","袋","炭","污","幕","諸","弧","勵","梅","奶","潔","災","舟","鑑","苯","訟","抱","毀","懂","寒","智","埔","寄","屆","躍","渡","挑","丹","艱","貝","碰","拔","爹","戴","碼","夢","芽","熔","赤","漁","哭","敬","顆","奔","鉛","仲","虎","稀","妹","乏","珍","申","桌","遵","允","隆","螺","倉","魏","銳","曉","氮","兼","隱","礙","赫","撥","忠","肅","缸","牽","搶","博","巧","殼","兄","杜","訊","誠","碧","祥","柯","頁","巡","矩","悲","灌","齡","倫","票","尋","桂","鋪","聖","恐","恰","鄭","趣","抬","荒","騰","貼","柔","滴","猛","闊","輛","妻","填","撤","儲","簽","鬧","擾","紫","砂","遞","戲","吊","陶","伐","餵","療","瓶","婆","撫","臂","摸","忍","蝦","蠟","鄰","胸","鞏","擠","偶","棄","槽","勁","乳","鄧","吉","仁","爛","磚","租","烏","艦","伴","瓜","淺","丙","暫","燥","橡","柳","迷","暖","牌","秧","膽","詳","簧","踏","瓷","譜","呆","賓","糊","洛","輝","憤","競","隙","怒","粘","乃","緒","肩","籍","敏","塗","熙","皆","偵","懸","掘","享","糾","醒","狂","鎖","淀","恨","牲","霸","爬","賞","逆","玩","陵","祝","秒","浙","貌","役","彼","悉","鴨","趨","鳳","晨","畜","輩","秩","卵","署","梯","炎","灘","棋","驅","篩","峽","冒","啥","壽","譯","浸","泉","帽","遲","矽","疆","貸","漏","稿","冠","嫩","脅","芯","牢","叛","蝕","奧","鳴","嶺","羊","憑","串","塘","繪","酵","融","盆","錫","廟","籌","凍","輔","攝","襲","筋","拒","僚","旱","鉀","鳥","漆","沈","眉","疏","添","棒","穗","硝","韓","逼","扭","僑","涼","挺","碗","栽","炒","杯","患","餾","勸","豪","遼","勃","鴻","旦","吏","拜","狗","埋","輥","掩","飲","搬","罵","辭","勾","扣","估","蔣","絨","霧","丈","朵","姆","擬","宇","輯","陝","雕","償","蓄","崇","剪","倡","廳","咬","駛","薯","刷","斥","番","賦","奉","佛","澆","漫","曼","扇","鈣","桃","扶","仔","返","俗","虧","腔","鞋","棱","覆","框","悄","叔","撞","騙","勘","旺","沸","孤","吐","孟","渠","屈","疾","妙","惜","仰","狠","脹","諧","拋","黴","桑","崗","嘛","衰","盜","滲","臟","賴","湧","甜","曹","閱","肌","哩","厲","烴","緯","毅","昨","偽","症","煮","嘆","釘","搭","莖","籠","酷","偷","弓","錐","恆","傑","坑","鼻","翼","綸","敘","獄","逮","罐","絡","棚","抑","膨","蔬","寺","驟","穆","冶","枯","冊","屍","凸","紳","坯","犧","焰","轟","欣","晉","瘦","禦","錠","錦","喪","旬","鍛","壟","搜","撲","邀","亭","酯","邁","舒","脆","酶","閒","憂","酚","頑","羽","漲","卸","仗","陪","闢","懲","杭","姚","肚","捉","飄","漂","昆","欺","吾","郎","烷","汁","呵","飾","蕭","雅","郵","遷","燕","撒","姻","赴","宴","煩","債","帳","斑","鈴","旨","醇","董","餅","雛","姿","拌","傅","腹","妥","揉","賢","拆","歪","葡","胺","丟","浩","徽","昂","墊","擋","覽","貪","慰","繳","汪","慌","馮","諾","姜","誼","兇","劣","誣","耀","昏","躺","盈","騎","喬","溪","叢","盧","抹","悶","諮","刮","駕","纜","悟","摘","鉺","擲","頗","幻","柄","惠","慘","佳","仇","臘","窩","滌","劍","瞧","堡","潑","蔥","罩","霍","撈","胎","蒼","濱","倆","捅","湘","砍","霞","邵","萄","瘋","淮","遂","熊","糞","烘","宿","檔","戈","駁","嫂","裕","徙","箭","捐","腸","撐","曬","辨","殿","蓮","攤","攪","醬","屏","疫","哀","蔡","堵","沫","皺","暢","疊","閣","萊","敲","轄","鉤","痕","壩","巷","餓","禍","丘","玄","溜","曰","邏","彭","嘗","卿","妨","艇","吞","韋","怨","矮","歇"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["가격","가끔","가난","가능","가득","가르침","가뭄","가방","가상","가슴","가운데","가을","가이드","가입","가장","가정","가족","가죽","각오","각자","간격","간부","간섭","간장","간접","간판","갈등","갈비","갈색","갈증","감각","감기","감소","감수성","감자","감정","갑자기","강남","강당","강도","강력히","강변","강북","강사","강수량","강아지","강원도","강의","강제","강조","같이","개구리","개나리","개방","개별","개선","개성","개인","객관적","거실","거액","거울","거짓","거품","걱정","건강","건물","건설","건조","건축","걸음","검사","검토","게시판","게임","겨울","견해","결과","결국","결론","결석","결승","결심","결정","결혼","경계","경고","경기","경력","경복궁","경비","경상도","경영","경우","경쟁","경제","경주","경찰","경치","경향","경험","계곡","계단","계란","계산","계속","계약","계절","계층","계획","고객","고구려","고궁","고급","고등학생","고무신","고민","고양이","고장","고전","고집","고춧가루","고통","고향","곡식","골목","골짜기","골프","공간","공개","공격","공군","공급","공기","공동","공무원","공부","공사","공식","공업","공연","공원","공장","공짜","공책","공통","공포","공항","공휴일","과목","과일","과장","과정","과학","관객","관계","관광","관념","관람","관련","관리","관습","관심","관점","관찰","광경","광고","광장","광주","괴로움","굉장히","교과서","교문","교복","교실","교양","교육","교장","교직","교통","교환","교훈","구경","구름","구멍","구별","구분","구석","구성","구속","구역","구입","구청","구체적","국가","국기","국내","국립","국물","국민","국수","국어","국왕","국적","국제","국회","군대","군사","군인","궁극적","권리","권위","권투","귀국","귀신","규정","규칙","균형","그날","그냥","그늘","그러나","그룹","그릇","그림","그제서야","그토록","극복","극히","근거","근교","근래","근로","근무","근본","근원","근육","근처","글씨","글자","금강산","금고","금년","금메달","금액","금연","금요일","금지","긍정적","기간","기관","기념","기능","기독교","기둥","기록","기름","기법","기본","기분","기쁨","기숙사","기술","기억","기업","기온","기운","기원","기적","기준","기침","기혼","기획","긴급","긴장","길이","김밥","김치","김포공항","깍두기","깜빡","깨달음","깨소금","껍질","꼭대기","꽃잎","나들이","나란히","나머지","나물","나침반","나흘","낙엽","난방","날개","날씨","날짜","남녀","남대문","남매","남산","남자","남편","남학생","낭비","낱말","내년","내용","내일","냄비","냄새","냇물","냉동","냉면","냉방","냉장고","넥타이","넷째","노동","노란색","노력","노인","녹음","녹차","녹화","논리","논문","논쟁","놀이","농구","농담","농민","농부","농업","농장","농촌","높이","눈동자","눈물","눈썹","뉴욕","느낌","늑대","능동적","능력","다방","다양성","다음","다이어트","다행","단계","단골","단독","단맛","단순","단어","단위","단점","단체","단추","단편","단풍","달걀","달러","달력","달리","닭고기","담당","담배","담요","담임","답변","답장","당근","당분간","당연히","당장","대규모","대낮","대단히","대답","대도시","대략","대량","대륙","대문","대부분","대신","대응","대장","대전","대접","대중","대책","대출","대충","대통령","대학","대한민국","대합실","대형","덩어리","데이트","도대체","도덕","도둑","도망","도서관","도심","도움","도입","도자기","도저히","도전","도중","도착","독감","독립","독서","독일","독창적","동화책","뒷모습","뒷산","딸아이","마누라","마늘","마당","마라톤","마련","마무리","마사지","마약","마요네즈","마을","마음","마이크","마중","마지막","마찬가지","마찰","마흔","막걸리","막내","막상","만남","만두","만세","만약","만일","만점","만족","만화","많이","말기","말씀","말투","맘대로","망원경","매년","매달","매력","매번","매스컴","매일","매장","맥주","먹이","먼저","먼지","멀리","메일","며느리","며칠","면담","멸치","명단","명령","명예","명의","명절","명칭","명함","모금","모니터","모델","모든","모범","모습","모양","모임","모조리","모집","모퉁이","목걸이","목록","목사","목소리","목숨","목적","목표","몰래","몸매","몸무게","몸살","몸속","몸짓","몸통","몹시","무관심","무궁화","무더위","무덤","무릎","무슨","무엇","무역","무용","무조건","무지개","무척","문구","문득","문법","문서","문제","문학","문화","물가","물건","물결","물고기","물론","물리학","물음","물질","물체","미국","미디어","미사일","미술","미역","미용실","미움","미인","미팅","미혼","민간","민족","민주","믿음","밀가루","밀리미터","밑바닥","바가지","바구니","바나나","바늘","바닥","바닷가","바람","바이러스","바탕","박물관","박사","박수","반대","반드시","반말","반발","반성","반응","반장","반죽","반지","반찬","받침","발가락","발걸음","발견","발달","발레","발목","발바닥","발생","발음","발자국","발전","발톱","발표","밤하늘","밥그릇","밥맛","밥상","밥솥","방금","방면","방문","방바닥","방법","방송","방식","방안","방울","방지","방학","방해","방향","배경","배꼽","배달","배드민턴","백두산","백색","백성","백인","백제","백화점","버릇","버섯","버튼","번개","번역","번지","번호","벌금","벌레","벌써","범위","범인","범죄","법률","법원","법적","법칙","베이징","벨트","변경","변동","변명","변신","변호사","변화","별도","별명","별일","병실","병아리","병원","보관","보너스","보라색","보람","보름","보상","보안","보자기","보장","보전","보존","보통","보편적","보험","복도","복사","복숭아","복습","볶음","본격적","본래","본부","본사","본성","본인","본질","볼펜","봉사","봉지","봉투","부근","부끄러움","부담","부동산","부문","부분","부산","부상","부엌","부인","부작용","부장","부정","부족","부지런히","부친","부탁","부품","부회장","북부","북한","분노","분량","분리","분명","분석","분야","분위기","분필","분홍색","불고기","불과","불교","불꽃","불만","불법","불빛","불안","불이익","불행","브랜드","비극","비난","비닐","비둘기","비디오","비로소","비만","비명","비밀","비바람","비빔밥","비상","비용","비율","비중","비타민","비판","빌딩","빗물","빗방울","빗줄기","빛깔","빨간색","빨래","빨리","사건","사계절","사나이","사냥","사람","사랑","사립","사모님","사물","사방","사상","사생활","사설","사슴","사실","사업","사용","사월","사장","사전","사진","사촌","사춘기","사탕","사투리","사흘","산길","산부인과","산업","산책","살림","살인","살짝","삼계탕","삼국","삼십","삼월","삼촌","상관","상금","상대","상류","상반기","상상","상식","상업","상인","상자","상점","상처","상추","상태","상표","상품","상황","새벽","색깔","색연필","생각","생명","생물","생방송","생산","생선","생신","생일","생활","서랍","서른","서명","서민","서비스","서양","서울","서적","서점","서쪽","서클","석사","석유","선거","선물","선배","선생","선수","선원","선장","선전","선택","선풍기","설거지","설날","설렁탕","설명","설문","설사","설악산","설치","설탕","섭씨","성공","성당","성명","성별","성인","성장","성적","성질","성함","세금","세미나","세상","세월","세종대왕","세탁","센터","센티미터","셋째","소규모","소극적","소금","소나기","소년","소득","소망","소문","소설","소속","소아과","소용","소원","소음","소중히","소지품","소질","소풍","소형","속담","속도","속옷","손가락","손길","손녀","손님","손등","손목","손뼉","손실","손질","손톱","손해","솔직히","솜씨","송아지","송이","송편","쇠고기","쇼핑","수건","수년","수단","수돗물","수동적","수면","수명","수박","수상","수석","수술","수시로","수업","수염","수영","수입","수준","수집","수출","수컷","수필","수학","수험생","수화기","숙녀","숙소","숙제","순간","순서","순수","순식간","순위","숟가락","술병","술집","숫자","스님","스물","스스로","스승","스웨터","스위치","스케이트","스튜디오","스트레스","스포츠","슬쩍","슬픔","습관","습기","승객","승리","승부","승용차","승진","시각","시간","시골","시금치","시나리오","시댁","시리즈","시멘트","시민","시부모","시선","시설","시스템","시아버지","시어머니","시월","시인","시일","시작","시장","시절","시점","시중","시즌","시집","시청","시합","시험","식구","식기","식당","식량","식료품","식물","식빵","식사","식생활","식초","식탁","식품","신고","신규","신념","신문","신발","신비","신사","신세","신용","신제품","신청","신체","신화","실감","실내","실력","실례","실망","실수","실습","실시","실장","실정","실질적","실천","실체","실컷","실태","실패","실험","실현","심리","심부름","심사","심장","심정","심판","쌍둥이","씨름","씨앗","아가씨","아나운서","아드님","아들","아쉬움","아스팔트","아시아","아울러","아저씨","아줌마","아직","아침","아파트","아프리카","아픔","아홉","아흔","악기","악몽","악수","안개","안경","안과","안내","안녕","안동","안방","안부","안주","알루미늄","알코올","암시","암컷","압력","앞날","앞문","애인","애정","액수","앨범","야간","야단","야옹","약간","약국","약속","약수","약점","약품","약혼녀","양념","양력","양말","양배추","양주","양파","어둠","어려움","어른","어젯밤","어쨌든","어쩌다가","어쩐지","언니","언덕","언론","언어","얼굴","얼른","얼음","얼핏","엄마","업무","업종","업체","엉덩이","엉망","엉터리","엊그제","에너지","에어컨","엔진","여건","여고생","여관","여군","여권","여대생","여덟","여동생","여든","여론","여름","여섯","여성","여왕","여인","여전히","여직원","여학생","여행","역사","역시","역할","연결","연구","연극","연기","연락","연설","연세","연속","연습","연애","연예인","연인","연장","연주","연출","연필","연합","연휴","열기","열매","열쇠","열심히","열정","열차","열흘","염려","엽서","영국","영남","영상","영양","영역","영웅","영원히","영하","영향","영혼","영화","옆구리","옆방","옆집","예감","예금","예방","예산","예상","예선","예술","예습","예식장","예약","예전","예절","예정","예컨대","옛날","오늘","오락","오랫동안","오렌지","오로지","오른발","오븐","오십","오염","오월","오전","오직","오징어","오페라","오피스텔","오히려","옥상","옥수수","온갖","온라인","온몸","온종일","온통","올가을","올림픽","올해","옷차림","와이셔츠","와인","완성","완전","왕비","왕자","왜냐하면","왠지","외갓집","외국","외로움","외삼촌","외출","외침","외할머니","왼발","왼손","왼쪽","요금","요일","요즘","요청","용기","용서","용어","우산","우선","우승","우연히","우정","우체국","우편","운동","운명","운반","운전","운행","울산","울음","움직임","웃어른","웃음","워낙","원고","원래","원서","원숭이","원인","원장","원피스","월급","월드컵","월세","월요일","웨이터","위반","위법","위성","위원","위험","위협","윗사람","유난히","유럽","유명","유물","유산","유적","유치원","유학","유행","유형","육군","육상","육십","육체","은행","음력","음료","음반","음성","음식","음악","음주","의견","의논","의문","의복","의식","의심","의외로","의욕","의원","의학","이것","이곳","이념","이놈","이달","이대로","이동","이렇게","이력서","이론적","이름","이민","이발소","이별","이불","이빨","이상","이성","이슬","이야기","이용","이웃","이월","이윽고","이익","이전","이중","이튿날","이틀","이혼","인간","인격","인공","인구","인근","인기","인도","인류","인물","인생","인쇄","인연","인원","인재","인종","인천","인체","인터넷","인하","인형","일곱","일기","일단","일대","일등","일반","일본","일부","일상","일생","일손","일요일","일월","일정","일종","일주일","일찍","일체","일치","일행","일회용","임금","임무","입대","입력","입맛","입사","입술","입시","입원","입장","입학","자가용","자격","자극","자동","자랑","자부심","자식","자신","자연","자원","자율","자전거","자정","자존심","자판","작가","작년","작성","작업","작용","작은딸","작품","잔디","잔뜩","잔치","잘못","잠깐","잠수함","잠시","잠옷","잠자리","잡지","장관","장군","장기간","장래","장례","장르","장마","장면","장모","장미","장비","장사","장소","장식","장애인","장인","장점","장차","장학금","재능","재빨리","재산","재생","재작년","재정","재채기","재판","재학","재활용","저것","저고리","저곳","저녁","저런","저렇게","저번","저울","저절로","저축","적극","적당히","적성","적용","적응","전개","전공","전기","전달","전라도","전망","전문","전반","전부","전세","전시","전용","전자","전쟁","전주","전철","전체","전통","전혀","전후","절대","절망","절반","절약","절차","점검","점수","점심","점원","점점","점차","접근","접시","접촉","젓가락","정거장","정도","정류장","정리","정말","정면","정문","정반대","정보","정부","정비","정상","정성","정오","정원","정장","정지","정치","정확히","제공","제과점","제대로","제목","제발","제법","제삿날","제안","제일","제작","제주도","제출","제품","제한","조각","조건","조금","조깅","조명","조미료","조상","조선","조용히","조절","조정","조직","존댓말","존재","졸업","졸음","종교","종로","종류","종소리","종업원","종종","종합","좌석","죄인","주관적","주름","주말","주머니","주먹","주문","주민","주방","주변","주식","주인","주일","주장","주전자","주택","준비","줄거리","줄기","줄무늬","중간","중계방송","중국","중년","중단","중독","중반","중부","중세","중소기업","중순","중앙","중요","중학교","즉석","즉시","즐거움","증가","증거","증권","증상","증세","지각","지갑","지경","지극히","지금","지급","지능","지름길","지리산","지방","지붕","지식","지역","지우개","지원","지적","지점","지진","지출","직선","직업","직원","직장","진급","진동","진로","진료","진리","진짜","진찰","진출","진통","진행","질문","질병","질서","짐작","집단","집안","집중","짜증","찌꺼기","차남","차라리","차량","차림","차별","차선","차츰","착각","찬물","찬성","참가","참기름","참새","참석","참여","참외","참조","찻잔","창가","창고","창구","창문","창밖","창작","창조","채널","채점","책가방","책방","책상","책임","챔피언","처벌","처음","천국","천둥","천장","천재","천천히","철도","철저히","철학","첫날","첫째","청년","청바지","청소","청춘","체계","체력","체온","체육","체중","체험","초등학생","초반","초밥","초상화","초순","초여름","초원","초저녁","초점","초청","초콜릿","촛불","총각","총리","총장","촬영","최근","최상","최선","최신","최악","최종","추석","추억","추진","추천","추측","축구","축소","축제","축하","출근","출발","출산","출신","출연","출입","출장","출판","충격","충고","충돌","충분히","충청도","취업","취직","취향","치약","친구","친척","칠십","칠월","칠판","침대","침묵","침실","칫솔","칭찬","카메라","카운터","칼국수","캐릭터","캠퍼스","캠페인","커튼","컨디션","컬러","컴퓨터","코끼리","코미디","콘서트","콜라","콤플렉스","콩나물","쾌감","쿠데타","크림","큰길","큰딸","큰소리","큰아들","큰어머니","큰일","큰절","클래식","클럽","킬로","타입","타자기","탁구","탁자","탄생","태권도","태양","태풍","택시","탤런트","터널","터미널","테니스","테스트","테이블","텔레비전","토론","토마토","토요일","통계","통과","통로","통신","통역","통일","통장","통제","통증","통합","통화","퇴근","퇴원","퇴직금","튀김","트럭","특급","특별","특성","특수","특징","특히","튼튼히","티셔츠","파란색","파일","파출소","판결","판단","판매","판사","팔십","팔월","팝송","패션","팩스","팩시밀리","팬티","퍼센트","페인트","편견","편의","편지","편히","평가","평균","평생","평소","평양","평일","평화","포스터","포인트","포장","포함","표면","표정","표준","표현","품목","품질","풍경","풍속","풍습","프랑스","프린터","플라스틱","피곤","피망","피아노","필름","필수","필요","필자","필통","핑계","하느님","하늘","하드웨어","하룻밤","하반기","하숙집","하순","하여튼","하지만","하천","하품","하필","학과","학교","학급","학기","학년","학력","학번","학부모","학비","학생","학술","학습","학용품","학원","학위","학자","학점","한계","한글","한꺼번에","한낮","한눈","한동안","한때","한라산","한마디","한문","한번","한복","한식","한여름","한쪽","할머니","할아버지","할인","함께","함부로","합격","합리적","항공","항구","항상","항의","해결","해군","해답","해당","해물","해석","해설","해수욕장","해안","핵심","핸드백","햄버거","햇볕","햇살","행동","행복","행사","행운","행위","향기","향상","향수","허락","허용","헬기","현관","현금","현대","현상","현실","현장","현재","현지","혈액","협력","형부","형사","형수","형식","형제","형태","형편","혜택","호기심","호남","호랑이","호박","호텔","호흡","혹시","홀로","홈페이지","홍보","홍수","홍차","화면","화분","화살","화요일","화장","화학","확보","확인","확장","확정","환갑","환경","환영","환율","환자","활기","활동","활발히","활용","활짝","회견","회관","회복","회색","회원","회장","회전","횟수","횡단보도","효율적","후반","후춧가루","훈련","훨씬","휴식","휴일","흉내","흐름","흑백","흑인","흔적","흔히","흥미","흥분","희곡","희망","희생","흰색","힘껏"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["abaisser","abandon","abdiquer","abeille","abolir","aborder","aboutir","aboyer","abrasif","abreuver","abriter","abroger","abrupt","absence","absolu","absurde","abusif","abyssal","académie","acajou","acarien","accabler","accepter","acclamer","accolade","accroche","accuser","acerbe","achat","acheter","aciduler","acier","acompte","acquérir","acronyme","acteur","actif","actuel","adepte","adéquat","adhésif","adjectif","adjuger","admettre","admirer","adopter","adorer","adoucir","adresse","adroit","adulte","adverbe","aérer","aéronef","affaire","affecter","affiche","affreux","affubler","agacer","agencer","agile","agiter","agrafer","agréable","agrume","aider","aiguille","ailier","aimable","aisance","ajouter","ajuster","alarmer","alchimie","alerte","algèbre","algue","aliéner","aliment","alléger","alliage","allouer","allumer","alourdir","alpaga","altesse","alvéole","amateur","ambigu","ambre","aménager","amertume","amidon","amiral","amorcer","amour","amovible","amphibie","ampleur","amusant","analyse","anaphore","anarchie","anatomie","ancien","anéantir","angle","angoisse","anguleux","animal","annexer","annonce","annuel","anodin","anomalie","anonyme","anormal","antenne","antidote","anxieux","apaiser","apéritif","aplanir","apologie","appareil","appeler","apporter","appuyer","aquarium","aqueduc","arbitre","arbuste","ardeur","ardoise","argent","arlequin","armature","armement","armoire","armure","arpenter","arracher","arriver","arroser","arsenic","artériel","article","aspect","asphalte","aspirer","assaut","asservir","assiette","associer","assurer","asticot","astre","astuce","atelier","atome","atrium","atroce","attaque","attentif","attirer","attraper","aubaine","auberge","audace","audible","augurer","aurore","automne","autruche","avaler","avancer","avarice","avenir","averse","aveugle","aviateur","avide","avion","aviser","avoine","avouer","avril","axial","axiome","badge","bafouer","bagage","baguette","baignade","balancer","balcon","baleine","balisage","bambin","bancaire","bandage","banlieue","bannière","banquier","barbier","baril","baron","barque","barrage","bassin","bastion","bataille","bateau","batterie","baudrier","bavarder","belette","bélier","belote","bénéfice","berceau","berger","berline","bermuda","besace","besogne","bétail","beurre","biberon","bicycle","bidule","bijou","bilan","bilingue","billard","binaire","biologie","biopsie","biotype","biscuit","bison","bistouri","bitume","bizarre","blafard","blague","blanchir","blessant","blinder","blond","bloquer","blouson","bobard","bobine","boire","boiser","bolide","bonbon","bondir","bonheur","bonifier","bonus","bordure","borne","botte","boucle","boueux","bougie","boulon","bouquin","bourse","boussole","boutique","boxeur","branche","brasier","brave","brebis","brèche","breuvage","bricoler","brigade","brillant","brioche","brique","brochure","broder","bronzer","brousse","broyeur","brume","brusque","brutal","bruyant","buffle","buisson","bulletin","bureau","burin","bustier","butiner","butoir","buvable","buvette","cabanon","cabine","cachette","cadeau","cadre","caféine","caillou","caisson","calculer","calepin","calibre","calmer","calomnie","calvaire","camarade","caméra","camion","campagne","canal","caneton","canon","cantine","canular","capable","caporal","caprice","capsule","capter","capuche","carabine","carbone","caresser","caribou","carnage","carotte","carreau","carton","cascade","casier","casque","cassure","causer","caution","cavalier","caverne","caviar","cédille","ceinture","céleste","cellule","cendrier","censurer","central","cercle","cérébral","cerise","cerner","cerveau","cesser","chagrin","chaise","chaleur","chambre","chance","chapitre","charbon","chasseur","chaton","chausson","chavirer","chemise","chenille","chéquier","chercher","cheval","chien","chiffre","chignon","chimère","chiot","chlorure","chocolat","choisir","chose","chouette","chrome","chute","cigare","cigogne","cimenter","cinéma","cintrer","circuler","cirer","cirque","citerne","citoyen","citron","civil","clairon","clameur","claquer","classe","clavier","client","cligner","climat","clivage","cloche","clonage","cloporte","cobalt","cobra","cocasse","cocotier","coder","codifier","coffre","cogner","cohésion","coiffer","coincer","colère","colibri","colline","colmater","colonel","combat","comédie","commande","compact","concert","conduire","confier","congeler","connoter","consonne","contact","convexe","copain","copie","corail","corbeau","cordage","corniche","corpus","correct","cortège","cosmique","costume","coton","coude","coupure","courage","couteau","couvrir","coyote","crabe","crainte","cravate","crayon","créature","créditer","crémeux","creuser","crevette","cribler","crier","cristal","critère","croire","croquer","crotale","crucial","cruel","crypter","cubique","cueillir","cuillère","cuisine","cuivre","culminer","cultiver","cumuler","cupide","curatif","curseur","cyanure","cycle","cylindre","cynique","daigner","damier","danger","danseur","dauphin","débattre","débiter","déborder","débrider","débutant","décaler","décembre","déchirer","décider","déclarer","décorer","décrire","décupler","dédale","déductif","déesse","défensif","défiler","défrayer","dégager","dégivrer","déglutir","dégrafer","déjeuner","délice","déloger","demander","demeurer","démolir","dénicher","dénouer","dentelle","dénuder","départ","dépenser","déphaser","déplacer","déposer","déranger","dérober","désastre","descente","désert","désigner","désobéir","dessiner","destrier","détacher","détester","détourer","détresse","devancer","devenir","deviner","devoir","diable","dialogue","diamant","dicter","différer","digérer","digital","digne","diluer","dimanche","diminuer","dioxyde","directif","diriger","discuter","disposer","dissiper","distance","divertir","diviser","docile","docteur","dogme","doigt","domaine","domicile","dompter","donateur","donjon","donner","dopamine","dortoir","dorure","dosage","doseur","dossier","dotation","douanier","double","douceur","douter","doyen","dragon","draper","dresser","dribbler","droiture","duperie","duplexe","durable","durcir","dynastie","éblouir","écarter","écharpe","échelle","éclairer","éclipse","éclore","écluse","école","économie","écorce","écouter","écraser","écrémer","écrivain","écrou","écume","écureuil","édifier","éduquer","effacer","effectif","effigie","effort","effrayer","effusion","égaliser","égarer","éjecter","élaborer","élargir","électron","élégant","éléphant","élève","éligible","élitisme","éloge","élucider","éluder","emballer","embellir","embryon","émeraude","émission","emmener","émotion","émouvoir","empereur","employer","emporter","emprise","émulsion","encadrer","enchère","enclave","encoche","endiguer","endosser","endroit","enduire","énergie","enfance","enfermer","enfouir","engager","engin","englober","énigme","enjamber","enjeu","enlever","ennemi","ennuyeux","enrichir","enrobage","enseigne","entasser","entendre","entier","entourer","entraver","énumérer","envahir","enviable","envoyer","enzyme","éolien","épaissir","épargne","épatant","épaule","épicerie","épidémie","épier","épilogue","épine","épisode","épitaphe","époque","épreuve","éprouver","épuisant","équerre","équipe","ériger","érosion","erreur","éruption","escalier","espadon","espèce","espiègle","espoir","esprit","esquiver","essayer","essence","essieu","essorer","estime","estomac","estrade","étagère","étaler","étanche","étatique","éteindre","étendoir","éternel","éthanol","éthique","ethnie","étirer","étoffer","étoile","étonnant","étourdir","étrange","étroit","étude","euphorie","évaluer","évasion","éventail","évidence","éviter","évolutif","évoquer","exact","exagérer","exaucer","exceller","excitant","exclusif","excuse","exécuter","exemple","exercer","exhaler","exhorter","exigence","exiler","exister","exotique","expédier","explorer","exposer","exprimer","exquis","extensif","extraire","exulter","fable","fabuleux","facette","facile","facture","faiblir","falaise","fameux","famille","farceur","farfelu","farine","farouche","fasciner","fatal","fatigue","faucon","fautif","faveur","favori","fébrile","féconder","fédérer","félin","femme","fémur","fendoir","féodal","fermer","féroce","ferveur","festival","feuille","feutre","février","fiasco","ficeler","fictif","fidèle","figure","filature","filetage","filière","filleul","filmer","filou","filtrer","financer","finir","fiole","firme","fissure","fixer","flairer","flamme","flasque","flatteur","fléau","flèche","fleur","flexion","flocon","flore","fluctuer","fluide","fluvial","folie","fonderie","fongible","fontaine","forcer","forgeron","formuler","fortune","fossile","foudre","fougère","fouiller","foulure","fourmi","fragile","fraise","franchir","frapper","frayeur","frégate","freiner","frelon","frémir","frénésie","frère","friable","friction","frisson","frivole","froid","fromage","frontal","frotter","fruit","fugitif","fuite","fureur","furieux","furtif","fusion","futur","gagner","galaxie","galerie","gambader","garantir","gardien","garnir","garrigue","gazelle","gazon","géant","gélatine","gélule","gendarme","général","génie","genou","gentil","géologie","géomètre","géranium","germe","gestuel","geyser","gibier","gicler","girafe","givre","glace","glaive","glisser","globe","gloire","glorieux","golfeur","gomme","gonfler","gorge","gorille","goudron","gouffre","goulot","goupille","gourmand","goutte","graduel","graffiti","graine","grand","grappin","gratuit","gravir","grenat","griffure","griller","grimper","grogner","gronder","grotte","groupe","gruger","grutier","gruyère","guépard","guerrier","guide","guimauve","guitare","gustatif","gymnaste","gyrostat","habitude","hachoir","halte","hameau","hangar","hanneton","haricot","harmonie","harpon","hasard","hélium","hématome","herbe","hérisson","hermine","héron","hésiter","heureux","hiberner","hibou","hilarant","histoire","hiver","homard","hommage","homogène","honneur","honorer","honteux","horde","horizon","horloge","hormone","horrible","houleux","housse","hublot","huileux","humain","humble","humide","humour","hurler","hydromel","hygiène","hymne","hypnose","idylle","ignorer","iguane","illicite","illusion","image","imbiber","imiter","immense","immobile","immuable","impact","impérial","implorer","imposer","imprimer","imputer","incarner","incendie","incident","incliner","incolore","indexer","indice","inductif","inédit","ineptie","inexact","infini","infliger","informer","infusion","ingérer","inhaler","inhiber","injecter","injure","innocent","inoculer","inonder","inscrire","insecte","insigne","insolite","inspirer","instinct","insulter","intact","intense","intime","intrigue","intuitif","inutile","invasion","inventer","inviter","invoquer","ironique","irradier","irréel","irriter","isoler","ivoire","ivresse","jaguar","jaillir","jambe","janvier","jardin","jauger","jaune","javelot","jetable","jeton","jeudi","jeunesse","joindre","joncher","jongler","joueur","jouissif","journal","jovial","joyau","joyeux","jubiler","jugement","junior","jupon","juriste","justice","juteux","juvénile","kayak","kimono","kiosque","label","labial","labourer","lacérer","lactose","lagune","laine","laisser","laitier","lambeau","lamelle","lampe","lanceur","langage","lanterne","lapin","largeur","larme","laurier","lavabo","lavoir","lecture","légal","léger","légume","lessive","lettre","levier","lexique","lézard","liasse","libérer","libre","licence","licorne","liège","lièvre","ligature","ligoter","ligue","limer","limite","limonade","limpide","linéaire","lingot","lionceau","liquide","lisière","lister","lithium","litige","littoral","livreur","logique","lointain","loisir","lombric","loterie","louer","lourd","loutre","louve","loyal","lubie","lucide","lucratif","lueur","lugubre","luisant","lumière","lunaire","lundi","luron","lutter","luxueux","machine","magasin","magenta","magique","maigre","maillon","maintien","mairie","maison","majorer","malaxer","maléfice","malheur","malice","mallette","mammouth","mandater","maniable","manquant","manteau","manuel","marathon","marbre","marchand","mardi","maritime","marqueur","marron","marteler","mascotte","massif","matériel","matière","matraque","maudire","maussade","mauve","maximal","méchant","méconnu","médaille","médecin","méditer","méduse","meilleur","mélange","mélodie","membre","mémoire","menacer","mener","menhir","mensonge","mentor","mercredi","mérite","merle","messager","mesure","métal","météore","méthode","métier","meuble","miauler","microbe","miette","mignon","migrer","milieu","million","mimique","mince","minéral","minimal","minorer","minute","miracle","miroiter","missile","mixte","mobile","moderne","moelleux","mondial","moniteur","monnaie","monotone","monstre","montagne","monument","moqueur","morceau","morsure","mortier","moteur","motif","mouche","moufle","moulin","mousson","mouton","mouvant","multiple","munition","muraille","murène","murmure","muscle","muséum","musicien","mutation","muter","mutuel","myriade","myrtille","mystère","mythique","nageur","nappe","narquois","narrer","natation","nation","nature","naufrage","nautique","navire","nébuleux","nectar","néfaste","négation","négliger","négocier","neige","nerveux","nettoyer","neurone","neutron","neveu","niche","nickel","nitrate","niveau","noble","nocif","nocturne","noirceur","noisette","nomade","nombreux","nommer","normatif","notable","notifier","notoire","nourrir","nouveau","novateur","novembre","novice","nuage","nuancer","nuire","nuisible","numéro","nuptial","nuque","nutritif","obéir","objectif","obliger","obscur","observer","obstacle","obtenir","obturer","occasion","occuper","océan","octobre","octroyer","octupler","oculaire","odeur","odorant","offenser","officier","offrir","ogive","oiseau","oisillon","olfactif","olivier","ombrage","omettre","onctueux","onduler","onéreux","onirique","opale","opaque","opérer","opinion","opportun","opprimer","opter","optique","orageux","orange","orbite","ordonner","oreille","organe","orgueil","orifice","ornement","orque","ortie","osciller","osmose","ossature","otarie","ouragan","ourson","outil","outrager","ouvrage","ovation","oxyde","oxygène","ozone","paisible","palace","palmarès","palourde","palper","panache","panda","pangolin","paniquer","panneau","panorama","pantalon","papaye","papier","papoter","papyrus","paradoxe","parcelle","paresse","parfumer","parler","parole","parrain","parsemer","partager","parure","parvenir","passion","pastèque","paternel","patience","patron","pavillon","pavoiser","payer","paysage","peigne","peintre","pelage","pélican","pelle","pelouse","peluche","pendule","pénétrer","pénible","pensif","pénurie","pépite","péplum","perdrix","perforer","période","permuter","perplexe","persil","perte","peser","pétale","petit","pétrir","peuple","pharaon","phobie","phoque","photon","phrase","physique","piano","pictural","pièce","pierre","pieuvre","pilote","pinceau","pipette","piquer","pirogue","piscine","piston","pivoter","pixel","pizza","placard","plafond","plaisir","planer","plaque","plastron","plateau","pleurer","plexus","pliage","plomb","plonger","pluie","plumage","pochette","poésie","poète","pointe","poirier","poisson","poivre","polaire","policier","pollen","polygone","pommade","pompier","ponctuel","pondérer","poney","portique","position","posséder","posture","potager","poteau","potion","pouce","poulain","poumon","pourpre","poussin","pouvoir","prairie","pratique","précieux","prédire","préfixe","prélude","prénom","présence","prétexte","prévoir","primitif","prince","prison","priver","problème","procéder","prodige","profond","progrès","proie","projeter","prologue","promener","propre","prospère","protéger","prouesse","proverbe","prudence","pruneau","psychose","public","puceron","puiser","pulpe","pulsar","punaise","punitif","pupitre","purifier","puzzle","pyramide","quasar","querelle","question","quiétude","quitter","quotient","racine","raconter","radieux","ragondin","raideur","raisin","ralentir","rallonge","ramasser","rapide","rasage","ratisser","ravager","ravin","rayonner","réactif","réagir","réaliser","réanimer","recevoir","réciter","réclamer","récolter","recruter","reculer","recycler","rédiger","redouter","refaire","réflexe","réformer","refrain","refuge","régalien","région","réglage","régulier","réitérer","rejeter","rejouer","relatif","relever","relief","remarque","remède","remise","remonter","remplir","remuer","renard","renfort","renifler","renoncer","rentrer","renvoi","replier","reporter","reprise","reptile","requin","réserve","résineux","résoudre","respect","rester","résultat","rétablir","retenir","réticule","retomber","retracer","réunion","réussir","revanche","revivre","révolte","révulsif","richesse","rideau","rieur","rigide","rigoler","rincer","riposter","risible","risque","rituel","rival","rivière","rocheux","romance","rompre","ronce","rondin","roseau","rosier","rotatif","rotor","rotule","rouge","rouille","rouleau","routine","royaume","ruban","rubis","ruche","ruelle","rugueux","ruiner","ruisseau","ruser","rustique","rythme","sabler","saboter","sabre","sacoche","safari","sagesse","saisir","salade","salive","salon","saluer","samedi","sanction","sanglier","sarcasme","sardine","saturer","saugrenu","saumon","sauter","sauvage","savant","savonner","scalpel","scandale","scélérat","scénario","sceptre","schéma","science","scinder","score","scrutin","sculpter","séance","sécable","sécher","secouer","sécréter","sédatif","séduire","seigneur","séjour","sélectif","semaine","sembler","semence","séminal","sénateur","sensible","sentence","séparer","séquence","serein","sergent","sérieux","serrure","sérum","service","sésame","sévir","sevrage","sextuple","sidéral","siècle","siéger","siffler","sigle","signal","silence","silicium","simple","sincère","sinistre","siphon","sirop","sismique","situer","skier","social","socle","sodium","soigneux","soldat","soleil","solitude","soluble","sombre","sommeil","somnoler","sonde","songeur","sonnette","sonore","sorcier","sortir","sosie","sottise","soucieux","soudure","souffle","soulever","soupape","source","soutirer","souvenir","spacieux","spatial","spécial","sphère","spiral","stable","station","sternum","stimulus","stipuler","strict","studieux","stupeur","styliste","sublime","substrat","subtil","subvenir","succès","sucre","suffixe","suggérer","suiveur","sulfate","superbe","supplier","surface","suricate","surmener","surprise","sursaut","survie","suspect","syllabe","symbole","symétrie","synapse","syntaxe","système","tabac","tablier","tactile","tailler","talent","talisman","talonner","tambour","tamiser","tangible","tapis","taquiner","tarder","tarif","tartine","tasse","tatami","tatouage","taupe","taureau","taxer","témoin","temporel","tenaille","tendre","teneur","tenir","tension","terminer","terne","terrible","tétine","texte","thème","théorie","thérapie","thorax","tibia","tiède","timide","tirelire","tiroir","tissu","titane","titre","tituber","toboggan","tolérant","tomate","tonique","tonneau","toponyme","torche","tordre","tornade","torpille","torrent","torse","tortue","totem","toucher","tournage","tousser","toxine","traction","trafic","tragique","trahir","train","trancher","travail","trèfle","tremper","trésor","treuil","triage","tribunal","tricoter","trilogie","triomphe","tripler","triturer","trivial","trombone","tronc","tropical","troupeau","tuile","tulipe","tumulte","tunnel","turbine","tuteur","tutoyer","tuyau","tympan","typhon","typique","tyran","ubuesque","ultime","ultrason","unanime","unifier","union","unique","unitaire","univers","uranium","urbain","urticant","usage","usine","usuel","usure","utile","utopie","vacarme","vaccin","vagabond","vague","vaillant","vaincre","vaisseau","valable","valise","vallon","valve","vampire","vanille","vapeur","varier","vaseux","vassal","vaste","vecteur","vedette","végétal","véhicule","veinard","véloce","vendredi","vénérer","venger","venimeux","ventouse","verdure","vérin","vernir","verrou","verser","vertu","veston","vétéran","vétuste","vexant","vexer","viaduc","viande","victoire","vidange","vidéo","vignette","vigueur","vilain","village","vinaigre","violon","vipère","virement","virtuose","virus","visage","viseur","vision","visqueux","visuel","vital","vitesse","viticole","vitrine","vivace","vivipare","vocation","voguer","voile","voisin","voiture","volaille","volcan","voltiger","volume","vorace","vortex","voter","vouloir","voyage","voyelle","wagon","xénon","yacht","zèbre","zénith","zeste","zoologie"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["abaco","abbaglio","abbinato","abete","abisso","abolire","abrasivo","abrogato","accadere","accenno","accusato","acetone","achille","acido","acqua","acre","acrilico","acrobata","acuto","adagio","addebito","addome","adeguato","aderire","adipe","adottare","adulare","affabile","affetto","affisso","affranto","aforisma","afoso","africano","agave","agente","agevole","aggancio","agire","agitare","agonismo","agricolo","agrumeto","aguzzo","alabarda","alato","albatro","alberato","albo","albume","alce","alcolico","alettone","alfa","algebra","aliante","alibi","alimento","allagato","allegro","allievo","allodola","allusivo","almeno","alogeno","alpaca","alpestre","altalena","alterno","alticcio","altrove","alunno","alveolo","alzare","amalgama","amanita","amarena","ambito","ambrato","ameba","america","ametista","amico","ammasso","ammenda","ammirare","ammonito","amore","ampio","ampliare","amuleto","anacardo","anagrafe","analista","anarchia","anatra","anca","ancella","ancora","andare","andrea","anello","angelo","angolare","angusto","anima","annegare","annidato","anno","annuncio","anonimo","anticipo","anzi","apatico","apertura","apode","apparire","appetito","appoggio","approdo","appunto","aprile","arabica","arachide","aragosta","araldica","arancio","aratura","arazzo","arbitro","archivio","ardito","arenile","argento","argine","arguto","aria","armonia","arnese","arredato","arringa","arrosto","arsenico","arso","artefice","arzillo","asciutto","ascolto","asepsi","asettico","asfalto","asino","asola","aspirato","aspro","assaggio","asse","assoluto","assurdo","asta","astenuto","astice","astratto","atavico","ateismo","atomico","atono","attesa","attivare","attorno","attrito","attuale","ausilio","austria","autista","autonomo","autunno","avanzato","avere","avvenire","avviso","avvolgere","azione","azoto","azzimo","azzurro","babele","baccano","bacino","baco","badessa","badilata","bagnato","baita","balcone","baldo","balena","ballata","balzano","bambino","bandire","baraonda","barbaro","barca","baritono","barlume","barocco","basilico","basso","batosta","battuto","baule","bava","bavosa","becco","beffa","belgio","belva","benda","benevole","benigno","benzina","bere","berlina","beta","bibita","bici","bidone","bifido","biga","bilancia","bimbo","binocolo","biologo","bipede","bipolare","birbante","birra","biscotto","bisesto","bisnonno","bisonte","bisturi","bizzarro","blando","blatta","bollito","bonifico","bordo","bosco","botanico","bottino","bozzolo","braccio","bradipo","brama","branca","bravura","bretella","brevetto","brezza","briglia","brillante","brindare","broccolo","brodo","bronzina","brullo","bruno","bubbone","buca","budino","buffone","buio","bulbo","buono","burlone","burrasca","bussola","busta","cadetto","caduco","calamaro","calcolo","calesse","calibro","calmo","caloria","cambusa","camerata","camicia","cammino","camola","campale","canapa","candela","cane","canino","canotto","cantina","capace","capello","capitolo","capogiro","cappero","capra","capsula","carapace","carcassa","cardo","carisma","carovana","carretto","cartolina","casaccio","cascata","caserma","caso","cassone","castello","casuale","catasta","catena","catrame","cauto","cavillo","cedibile","cedrata","cefalo","celebre","cellulare","cena","cenone","centesimo","ceramica","cercare","certo","cerume","cervello","cesoia","cespo","ceto","chela","chiaro","chicca","chiedere","chimera","china","chirurgo","chitarra","ciao","ciclismo","cifrare","cigno","cilindro","ciottolo","circa","cirrosi","citrico","cittadino","ciuffo","civetta","civile","classico","clinica","cloro","cocco","codardo","codice","coerente","cognome","collare","colmato","colore","colposo","coltivato","colza","coma","cometa","commando","comodo","computer","comune","conciso","condurre","conferma","congelare","coniuge","connesso","conoscere","consumo","continuo","convegno","coperto","copione","coppia","copricapo","corazza","cordata","coricato","cornice","corolla","corpo","corredo","corsia","cortese","cosmico","costante","cottura","covato","cratere","cravatta","creato","credere","cremoso","crescita","creta","criceto","crinale","crisi","critico","croce","cronaca","crostata","cruciale","crusca","cucire","cuculo","cugino","cullato","cupola","curatore","cursore","curvo","cuscino","custode","dado","daino","dalmata","damerino","daniela","dannoso","danzare","datato","davanti","davvero","debutto","decennio","deciso","declino","decollo","decreto","dedicato","definito","deforme","degno","delegare","delfino","delirio","delta","demenza","denotato","dentro","deposito","derapata","derivare","deroga","descritto","deserto","desiderio","desumere","detersivo","devoto","diametro","dicembre","diedro","difeso","diffuso","digerire","digitale","diluvio","dinamico","dinnanzi","dipinto","diploma","dipolo","diradare","dire","dirotto","dirupo","disagio","discreto","disfare","disgelo","disposto","distanza","disumano","dito","divano","divelto","dividere","divorato","doblone","docente","doganale","dogma","dolce","domato","domenica","dominare","dondolo","dono","dormire","dote","dottore","dovuto","dozzina","drago","druido","dubbio","dubitare","ducale","duna","duomo","duplice","duraturo","ebano","eccesso","ecco","eclissi","economia","edera","edicola","edile","editoria","educare","egemonia","egli","egoismo","egregio","elaborato","elargire","elegante","elencato","eletto","elevare","elfico","elica","elmo","elsa","eluso","emanato","emblema","emesso","emiro","emotivo","emozione","empirico","emulo","endemico","enduro","energia","enfasi","enoteca","entrare","enzima","epatite","epilogo","episodio","epocale","eppure","equatore","erario","erba","erboso","erede","eremita","erigere","ermetico","eroe","erosivo","errante","esagono","esame","esanime","esaudire","esca","esempio","esercito","esibito","esigente","esistere","esito","esofago","esortato","esoso","espanso","espresso","essenza","esso","esteso","estimare","estonia","estroso","esultare","etilico","etnico","etrusco","etto","euclideo","europa","evaso","evidenza","evitato","evoluto","evviva","fabbrica","faccenda","fachiro","falco","famiglia","fanale","fanfara","fango","fantasma","fare","farfalla","farinoso","farmaco","fascia","fastoso","fasullo","faticare","fato","favoloso","febbre","fecola","fede","fegato","felpa","feltro","femmina","fendere","fenomeno","fermento","ferro","fertile","fessura","festivo","fetta","feudo","fiaba","fiducia","fifa","figurato","filo","finanza","finestra","finire","fiore","fiscale","fisico","fiume","flacone","flamenco","flebo","flemma","florido","fluente","fluoro","fobico","focaccia","focoso","foderato","foglio","folata","folclore","folgore","fondente","fonetico","fonia","fontana","forbito","forchetta","foresta","formica","fornaio","foro","fortezza","forzare","fosfato","fosso","fracasso","frana","frassino","fratello","freccetta","frenata","fresco","frigo","frollino","fronde","frugale","frutta","fucilata","fucsia","fuggente","fulmine","fulvo","fumante","fumetto","fumoso","fune","funzione","fuoco","furbo","furgone","furore","fuso","futile","gabbiano","gaffe","galateo","gallina","galoppo","gambero","gamma","garanzia","garbo","garofano","garzone","gasdotto","gasolio","gastrico","gatto","gaudio","gazebo","gazzella","geco","gelatina","gelso","gemello","gemmato","gene","genitore","gennaio","genotipo","gergo","ghepardo","ghiaccio","ghisa","giallo","gilda","ginepro","giocare","gioiello","giorno","giove","girato","girone","gittata","giudizio","giurato","giusto","globulo","glutine","gnomo","gobba","golf","gomito","gommone","gonfio","gonna","governo","gracile","grado","grafico","grammo","grande","grattare","gravoso","grazia","greca","gregge","grifone","grigio","grinza","grotta","gruppo","guadagno","guaio","guanto","guardare","gufo","guidare","ibernato","icona","identico","idillio","idolo","idra","idrico","idrogeno","igiene","ignaro","ignorato","ilare","illeso","illogico","illudere","imballo","imbevuto","imbocco","imbuto","immane","immerso","immolato","impacco","impeto","impiego","importo","impronta","inalare","inarcare","inattivo","incanto","incendio","inchino","incisivo","incluso","incontro","incrocio","incubo","indagine","india","indole","inedito","infatti","infilare","inflitto","ingaggio","ingegno","inglese","ingordo","ingrosso","innesco","inodore","inoltrare","inondato","insano","insetto","insieme","insonnia","insulina","intasato","intero","intonaco","intuito","inumidire","invalido","invece","invito","iperbole","ipnotico","ipotesi","ippica","iride","irlanda","ironico","irrigato","irrorare","isolato","isotopo","isterico","istituto","istrice","italia","iterare","labbro","labirinto","lacca","lacerato","lacrima","lacuna","laddove","lago","lampo","lancetta","lanterna","lardoso","larga","laringe","lastra","latenza","latino","lattuga","lavagna","lavoro","legale","leggero","lembo","lentezza","lenza","leone","lepre","lesivo","lessato","lesto","letterale","leva","levigato","libero","lido","lievito","lilla","limatura","limitare","limpido","lineare","lingua","liquido","lira","lirica","lisca","lite","litigio","livrea","locanda","lode","logica","lombare","londra","longevo","loquace","lorenzo","loto","lotteria","luce","lucidato","lumaca","luminoso","lungo","lupo","luppolo","lusinga","lusso","lutto","macabro","macchina","macero","macinato","madama","magico","maglia","magnete","magro","maiolica","malafede","malgrado","malinteso","malsano","malto","malumore","mana","mancia","mandorla","mangiare","manifesto","mannaro","manovra","mansarda","mantide","manubrio","mappa","maratona","marcire","maretta","marmo","marsupio","maschera","massaia","mastino","materasso","matricola","mattone","maturo","mazurca","meandro","meccanico","mecenate","medesimo","meditare","mega","melassa","melis","melodia","meninge","meno","mensola","mercurio","merenda","merlo","meschino","mese","messere","mestolo","metallo","metodo","mettere","miagolare","mica","micelio","michele","microbo","midollo","miele","migliore","milano","milite","mimosa","minerale","mini","minore","mirino","mirtillo","miscela","missiva","misto","misurare","mitezza","mitigare","mitra","mittente","mnemonico","modello","modifica","modulo","mogano","mogio","mole","molosso","monastero","monco","mondina","monetario","monile","monotono","monsone","montato","monviso","mora","mordere","morsicato","mostro","motivato","motosega","motto","movenza","movimento","mozzo","mucca","mucosa","muffa","mughetto","mugnaio","mulatto","mulinello","multiplo","mummia","munto","muovere","murale","musa","muscolo","musica","mutevole","muto","nababbo","nafta","nanometro","narciso","narice","narrato","nascere","nastrare","naturale","nautica","naviglio","nebulosa","necrosi","negativo","negozio","nemmeno","neofita","neretto","nervo","nessuno","nettuno","neutrale","neve","nevrotico","nicchia","ninfa","nitido","nobile","nocivo","nodo","nome","nomina","nordico","normale","norvegese","nostrano","notare","notizia","notturno","novella","nucleo","nulla","numero","nuovo","nutrire","nuvola","nuziale","oasi","obbedire","obbligo","obelisco","oblio","obolo","obsoleto","occasione","occhio","occidente","occorrere","occultare","ocra","oculato","odierno","odorare","offerta","offrire","offuscato","oggetto","oggi","ognuno","olandese","olfatto","oliato","oliva","ologramma","oltre","omaggio","ombelico","ombra","omega","omissione","ondoso","onere","onice","onnivoro","onorevole","onta","operato","opinione","opposto","oracolo","orafo","ordine","orecchino","orefice","orfano","organico","origine","orizzonte","orma","ormeggio","ornativo","orologio","orrendo","orribile","ortensia","ortica","orzata","orzo","osare","oscurare","osmosi","ospedale","ospite","ossa","ossidare","ostacolo","oste","otite","otre","ottagono","ottimo","ottobre","ovale","ovest","ovino","oviparo","ovocito","ovunque","ovviare","ozio","pacchetto","pace","pacifico","padella","padrone","paese","paga","pagina","palazzina","palesare","pallido","palo","palude","pandoro","pannello","paolo","paonazzo","paprica","parabola","parcella","parere","pargolo","pari","parlato","parola","partire","parvenza","parziale","passivo","pasticca","patacca","patologia","pattume","pavone","peccato","pedalare","pedonale","peggio","peloso","penare","pendice","penisola","pennuto","penombra","pensare","pentola","pepe","pepita","perbene","percorso","perdonato","perforare","pergamena","periodo","permesso","perno","perplesso","persuaso","pertugio","pervaso","pesatore","pesista","peso","pestifero","petalo","pettine","petulante","pezzo","piacere","pianta","piattino","piccino","picozza","piega","pietra","piffero","pigiama","pigolio","pigro","pila","pilifero","pillola","pilota","pimpante","pineta","pinna","pinolo","pioggia","piombo","piramide","piretico","pirite","pirolisi","pitone","pizzico","placebo","planare","plasma","platano","plenario","pochezza","poderoso","podismo","poesia","poggiare","polenta","poligono","pollice","polmonite","polpetta","polso","poltrona","polvere","pomice","pomodoro","ponte","popoloso","porfido","poroso","porpora","porre","portata","posa","positivo","possesso","postulato","potassio","potere","pranzo","prassi","pratica","precluso","predica","prefisso","pregiato","prelievo","premere","prenotare","preparato","presenza","pretesto","prevalso","prima","principe","privato","problema","procura","produrre","profumo","progetto","prolunga","promessa","pronome","proposta","proroga","proteso","prova","prudente","prugna","prurito","psiche","pubblico","pudica","pugilato","pugno","pulce","pulito","pulsante","puntare","pupazzo","pupilla","puro","quadro","qualcosa","quasi","querela","quota","raccolto","raddoppio","radicale","radunato","raffica","ragazzo","ragione","ragno","ramarro","ramingo","ramo","randagio","rantolare","rapato","rapina","rappreso","rasatura","raschiato","rasente","rassegna","rastrello","rata","ravveduto","reale","recepire","recinto","recluta","recondito","recupero","reddito","redimere","regalato","registro","regola","regresso","relazione","remare","remoto","renna","replica","reprimere","reputare","resa","residente","responso","restauro","rete","retina","retorica","rettifica","revocato","riassunto","ribadire","ribelle","ribrezzo","ricarica","ricco","ricevere","riciclato","ricordo","ricreduto","ridicolo","ridurre","rifasare","riflesso","riforma","rifugio","rigare","rigettato","righello","rilassato","rilevato","rimanere","rimbalzo","rimedio","rimorchio","rinascita","rincaro","rinforzo","rinnovo","rinomato","rinsavito","rintocco","rinuncia","rinvenire","riparato","ripetuto","ripieno","riportare","ripresa","ripulire","risata","rischio","riserva","risibile","riso","rispetto","ristoro","risultato","risvolto","ritardo","ritegno","ritmico","ritrovo","riunione","riva","riverso","rivincita","rivolto","rizoma","roba","robotico","robusto","roccia","roco","rodaggio","rodere","roditore","rogito","rollio","romantico","rompere","ronzio","rosolare","rospo","rotante","rotondo","rotula","rovescio","rubizzo","rubrica","ruga","rullino","rumine","rumoroso","ruolo","rupe","russare","rustico","sabato","sabbiare","sabotato","sagoma","salasso","saldatura","salgemma","salivare","salmone","salone","saltare","saluto","salvo","sapere","sapido","saporito","saraceno","sarcasmo","sarto","sassoso","satellite","satira","satollo","saturno","savana","savio","saziato","sbadiglio","sbalzo","sbancato","sbarra","sbattere","sbavare","sbendare","sbirciare","sbloccato","sbocciato","sbrinare","sbruffone","sbuffare","scabroso","scadenza","scala","scambiare","scandalo","scapola","scarso","scatenare","scavato","scelto","scenico","scettro","scheda","schiena","sciarpa","scienza","scindere","scippo","sciroppo","scivolo","sclerare","scodella","scolpito","scomparto","sconforto","scoprire","scorta","scossone","scozzese","scriba","scrollare","scrutinio","scuderia","scultore","scuola","scuro","scusare","sdebitare","sdoganare","seccatura","secondo","sedano","seggiola","segnalato","segregato","seguito","selciato","selettivo","sella","selvaggio","semaforo","sembrare","seme","seminato","sempre","senso","sentire","sepolto","sequenza","serata","serbato","sereno","serio","serpente","serraglio","servire","sestina","setola","settimana","sfacelo","sfaldare","sfamato","sfarzoso","sfaticato","sfera","sfida","sfilato","sfinge","sfocato","sfoderare","sfogo","sfoltire","sforzato","sfratto","sfruttato","sfuggito","sfumare","sfuso","sgabello","sgarbato","sgonfiare","sgorbio","sgrassato","sguardo","sibilo","siccome","sierra","sigla","signore","silenzio","sillaba","simbolo","simpatico","simulato","sinfonia","singolo","sinistro","sino","sintesi","sinusoide","sipario","sisma","sistole","situato","slitta","slogatura","sloveno","smarrito","smemorato","smentito","smeraldo","smilzo","smontare","smottato","smussato","snellire","snervato","snodo","sobbalzo","sobrio","soccorso","sociale","sodale","soffitto","sogno","soldato","solenne","solido","sollazzo","solo","solubile","solvente","somatico","somma","sonda","sonetto","sonnifero","sopire","soppeso","sopra","sorgere","sorpasso","sorriso","sorso","sorteggio","sorvolato","sospiro","sosta","sottile","spada","spalla","spargere","spatola","spavento","spazzola","specie","spedire","spegnere","spelatura","speranza","spessore","spettrale","spezzato","spia","spigoloso","spillato","spinoso","spirale","splendido","sportivo","sposo","spranga","sprecare","spronato","spruzzo","spuntino","squillo","sradicare","srotolato","stabile","stacco","staffa","stagnare","stampato","stantio","starnuto","stasera","statuto","stelo","steppa","sterzo","stiletto","stima","stirpe","stivale","stizzoso","stonato","storico","strappo","stregato","stridulo","strozzare","strutto","stuccare","stufo","stupendo","subentro","succoso","sudore","suggerito","sugo","sultano","suonare","superbo","supporto","surgelato","surrogato","sussurro","sutura","svagare","svedese","sveglio","svelare","svenuto","svezia","sviluppo","svista","svizzera","svolta","svuotare","tabacco","tabulato","tacciare","taciturno","tale","talismano","tampone","tannino","tara","tardivo","targato","tariffa","tarpare","tartaruga","tasto","tattico","taverna","tavolata","tazza","teca","tecnico","telefono","temerario","tempo","temuto","tendone","tenero","tensione","tentacolo","teorema","terme","terrazzo","terzetto","tesi","tesserato","testato","tetro","tettoia","tifare","tigella","timbro","tinto","tipico","tipografo","tiraggio","tiro","titanio","titolo","titubante","tizio","tizzone","toccare","tollerare","tolto","tombola","tomo","tonfo","tonsilla","topazio","topologia","toppa","torba","tornare","torrone","tortora","toscano","tossire","tostatura","totano","trabocco","trachea","trafila","tragedia","tralcio","tramonto","transito","trapano","trarre","trasloco","trattato","trave","treccia","tremolio","trespolo","tributo","tricheco","trifoglio","trillo","trincea","trio","tristezza","triturato","trivella","tromba","trono","troppo","trottola","trovare","truccato","tubatura","tuffato","tulipano","tumulto","tunisia","turbare","turchino","tuta","tutela","ubicato","uccello","uccisore","udire","uditivo","uffa","ufficio","uguale","ulisse","ultimato","umano","umile","umorismo","uncinetto","ungere","ungherese","unicorno","unificato","unisono","unitario","unte","uovo","upupa","uragano","urgenza","urlo","usanza","usato","uscito","usignolo","usuraio","utensile","utilizzo","utopia","vacante","vaccinato","vagabondo","vagliato","valanga","valgo","valico","valletta","valoroso","valutare","valvola","vampata","vangare","vanitoso","vano","vantaggio","vanvera","vapore","varano","varcato","variante","vasca","vedetta","vedova","veduto","vegetale","veicolo","velcro","velina","velluto","veloce","venato","vendemmia","vento","verace","verbale","vergogna","verifica","vero","verruca","verticale","vescica","vessillo","vestale","veterano","vetrina","vetusto","viandante","vibrante","vicenda","vichingo","vicinanza","vidimare","vigilia","vigneto","vigore","vile","villano","vimini","vincitore","viola","vipera","virgola","virologo","virulento","viscoso","visione","vispo","vissuto","visura","vita","vitello","vittima","vivanda","vivido","viziare","voce","voga","volatile","volere","volpe","voragine","vulcano","zampogna","zanna","zappato","zattera","zavorra","zefiro","zelante","zelo","zenzero","zerbino","zibetto","zinco","zircone","zitto","zolla","zotico","zucchero","zufolo","zulu","zuppa"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["ábaco","abdomen","abeja","abierto","abogado","abono","aborto","abrazo","abrir","abuelo","abuso","acabar","academia","acceso","acción","aceite","acelga","acento","aceptar","ácido","aclarar","acné","acoger","acoso","activo","acto","actriz","actuar","acudir","acuerdo","acusar","adicto","admitir","adoptar","adorno","aduana","adulto","aéreo","afectar","afición","afinar","afirmar","ágil","agitar","agonía","agosto","agotar","agregar","agrio","agua","agudo","águila","aguja","ahogo","ahorro","aire","aislar","ajedrez","ajeno","ajuste","alacrán","alambre","alarma","alba","álbum","alcalde","aldea","alegre","alejar","alerta","aleta","alfiler","alga","algodón","aliado","aliento","alivio","alma","almeja","almíbar","altar","alteza","altivo","alto","altura","alumno","alzar","amable","amante","amapola","amargo","amasar","ámbar","ámbito","ameno","amigo","amistad","amor","amparo","amplio","ancho","anciano","ancla","andar","andén","anemia","ángulo","anillo","ánimo","anís","anotar","antena","antiguo","antojo","anual","anular","anuncio","añadir","añejo","año","apagar","aparato","apetito","apio","aplicar","apodo","aporte","apoyo","aprender","aprobar","apuesta","apuro","arado","araña","arar","árbitro","árbol","arbusto","archivo","arco","arder","ardilla","arduo","área","árido","aries","armonía","arnés","aroma","arpa","arpón","arreglo","arroz","arruga","arte","artista","asa","asado","asalto","ascenso","asegurar","aseo","asesor","asiento","asilo","asistir","asno","asombro","áspero","astilla","astro","astuto","asumir","asunto","atajo","ataque","atar","atento","ateo","ático","atleta","átomo","atraer","atroz","atún","audaz","audio","auge","aula","aumento","ausente","autor","aval","avance","avaro","ave","avellana","avena","avestruz","avión","aviso","ayer","ayuda","ayuno","azafrán","azar","azote","azúcar","azufre","azul","baba","babor","bache","bahía","baile","bajar","balanza","balcón","balde","bambú","banco","banda","baño","barba","barco","barniz","barro","báscula","bastón","basura","batalla","batería","batir","batuta","baúl","bazar","bebé","bebida","bello","besar","beso","bestia","bicho","bien","bingo","blanco","bloque","blusa","boa","bobina","bobo","boca","bocina","boda","bodega","boina","bola","bolero","bolsa","bomba","bondad","bonito","bono","bonsái","borde","borrar","bosque","bote","botín","bóveda","bozal","bravo","brazo","brecha","breve","brillo","brinco","brisa","broca","broma","bronce","brote","bruja","brusco","bruto","buceo","bucle","bueno","buey","bufanda","bufón","búho","buitre","bulto","burbuja","burla","burro","buscar","butaca","buzón","caballo","cabeza","cabina","cabra","cacao","cadáver","cadena","caer","café","caída","caimán","caja","cajón","cal","calamar","calcio","caldo","calidad","calle","calma","calor","calvo","cama","cambio","camello","camino","campo","cáncer","candil","canela","canguro","canica","canto","caña","cañón","caoba","caos","capaz","capitán","capote","captar","capucha","cara","carbón","cárcel","careta","carga","cariño","carne","carpeta","carro","carta","casa","casco","casero","caspa","castor","catorce","catre","caudal","causa","cazo","cebolla","ceder","cedro","celda","célebre","celoso","célula","cemento","ceniza","centro","cerca","cerdo","cereza","cero","cerrar","certeza","césped","cetro","chacal","chaleco","champú","chancla","chapa","charla","chico","chiste","chivo","choque","choza","chuleta","chupar","ciclón","ciego","cielo","cien","cierto","cifra","cigarro","cima","cinco","cine","cinta","ciprés","circo","ciruela","cisne","cita","ciudad","clamor","clan","claro","clase","clave","cliente","clima","clínica","cobre","cocción","cochino","cocina","coco","código","codo","cofre","coger","cohete","cojín","cojo","cola","colcha","colegio","colgar","colina","collar","colmo","columna","combate","comer","comida","cómodo","compra","conde","conejo","conga","conocer","consejo","contar","copa","copia","corazón","corbata","corcho","cordón","corona","correr","coser","cosmos","costa","cráneo","cráter","crear","crecer","creído","crema","cría","crimen","cripta","crisis","cromo","crónica","croqueta","crudo","cruz","cuadro","cuarto","cuatro","cubo","cubrir","cuchara","cuello","cuento","cuerda","cuesta","cueva","cuidar","culebra","culpa","culto","cumbre","cumplir","cuna","cuneta","cuota","cupón","cúpula","curar","curioso","curso","curva","cutis","dama","danza","dar","dardo","dátil","deber","débil","década","decir","dedo","defensa","definir","dejar","delfín","delgado","delito","demora","denso","dental","deporte","derecho","derrota","desayuno","deseo","desfile","desnudo","destino","desvío","detalle","detener","deuda","día","diablo","diadema","diamante","diana","diario","dibujo","dictar","diente","dieta","diez","difícil","digno","dilema","diluir","dinero","directo","dirigir","disco","diseño","disfraz","diva","divino","doble","doce","dolor","domingo","don","donar","dorado","dormir","dorso","dos","dosis","dragón","droga","ducha","duda","duelo","dueño","dulce","dúo","duque","durar","dureza","duro","ébano","ebrio","echar","eco","ecuador","edad","edición","edificio","editor","educar","efecto","eficaz","eje","ejemplo","elefante","elegir","elemento","elevar","elipse","élite","elixir","elogio","eludir","embudo","emitir","emoción","empate","empeño","empleo","empresa","enano","encargo","enchufe","encía","enemigo","enero","enfado","enfermo","engaño","enigma","enlace","enorme","enredo","ensayo","enseñar","entero","entrar","envase","envío","época","equipo","erizo","escala","escena","escolar","escribir","escudo","esencia","esfera","esfuerzo","espada","espejo","espía","esposa","espuma","esquí","estar","este","estilo","estufa","etapa","eterno","ética","etnia","evadir","evaluar","evento","evitar","exacto","examen","exceso","excusa","exento","exigir","exilio","existir","éxito","experto","explicar","exponer","extremo","fábrica","fábula","fachada","fácil","factor","faena","faja","falda","fallo","falso","faltar","fama","familia","famoso","faraón","farmacia","farol","farsa","fase","fatiga","fauna","favor","fax","febrero","fecha","feliz","feo","feria","feroz","fértil","fervor","festín","fiable","fianza","fiar","fibra","ficción","ficha","fideo","fiebre","fiel","fiera","fiesta","figura","fijar","fijo","fila","filete","filial","filtro","fin","finca","fingir","finito","firma","flaco","flauta","flecha","flor","flota","fluir","flujo","flúor","fobia","foca","fogata","fogón","folio","folleto","fondo","forma","forro","fortuna","forzar","fosa","foto","fracaso","frágil","franja","frase","fraude","freír","freno","fresa","frío","frito","fruta","fuego","fuente","fuerza","fuga","fumar","función","funda","furgón","furia","fusil","fútbol","futuro","gacela","gafas","gaita","gajo","gala","galería","gallo","gamba","ganar","gancho","ganga","ganso","garaje","garza","gasolina","gastar","gato","gavilán","gemelo","gemir","gen","género","genio","gente","geranio","gerente","germen","gesto","gigante","gimnasio","girar","giro","glaciar","globo","gloria","gol","golfo","goloso","golpe","goma","gordo","gorila","gorra","gota","goteo","gozar","grada","gráfico","grano","grasa","gratis","grave","grieta","grillo","gripe","gris","grito","grosor","grúa","grueso","grumo","grupo","guante","guapo","guardia","guerra","guía","guiño","guion","guiso","guitarra","gusano","gustar","haber","hábil","hablar","hacer","hacha","hada","hallar","hamaca","harina","haz","hazaña","hebilla","hebra","hecho","helado","helio","hembra","herir","hermano","héroe","hervir","hielo","hierro","hígado","higiene","hijo","himno","historia","hocico","hogar","hoguera","hoja","hombre","hongo","honor","honra","hora","hormiga","horno","hostil","hoyo","hueco","huelga","huerta","hueso","huevo","huida","huir","humano","húmedo","humilde","humo","hundir","huracán","hurto","icono","ideal","idioma","ídolo","iglesia","iglú","igual","ilegal","ilusión","imagen","imán","imitar","impar","imperio","imponer","impulso","incapaz","índice","inerte","infiel","informe","ingenio","inicio","inmenso","inmune","innato","insecto","instante","interés","íntimo","intuir","inútil","invierno","ira","iris","ironía","isla","islote","jabalí","jabón","jamón","jarabe","jardín","jarra","jaula","jazmín","jefe","jeringa","jinete","jornada","joroba","joven","joya","juerga","jueves","juez","jugador","jugo","juguete","juicio","junco","jungla","junio","juntar","júpiter","jurar","justo","juvenil","juzgar","kilo","koala","labio","lacio","lacra","lado","ladrón","lagarto","lágrima","laguna","laico","lamer","lámina","lámpara","lana","lancha","langosta","lanza","lápiz","largo","larva","lástima","lata","látex","latir","laurel","lavar","lazo","leal","lección","leche","lector","leer","legión","legumbre","lejano","lengua","lento","leña","león","leopardo","lesión","letal","letra","leve","leyenda","libertad","libro","licor","líder","lidiar","lienzo","liga","ligero","lima","límite","limón","limpio","lince","lindo","línea","lingote","lino","linterna","líquido","liso","lista","litera","litio","litro","llaga","llama","llanto","llave","llegar","llenar","llevar","llorar","llover","lluvia","lobo","loción","loco","locura","lógica","logro","lombriz","lomo","lonja","lote","lucha","lucir","lugar","lujo","luna","lunes","lupa","lustro","luto","luz","maceta","macho","madera","madre","maduro","maestro","mafia","magia","mago","maíz","maldad","maleta","malla","malo","mamá","mambo","mamut","manco","mando","manejar","manga","maniquí","manjar","mano","manso","manta","mañana","mapa","máquina","mar","marco","marea","marfil","margen","marido","mármol","marrón","martes","marzo","masa","máscara","masivo","matar","materia","matiz","matriz","máximo","mayor","mazorca","mecha","medalla","medio","médula","mejilla","mejor","melena","melón","memoria","menor","mensaje","mente","menú","mercado","merengue","mérito","mes","mesón","meta","meter","método","metro","mezcla","miedo","miel","miembro","miga","mil","milagro","militar","millón","mimo","mina","minero","mínimo","minuto","miope","mirar","misa","miseria","misil","mismo","mitad","mito","mochila","moción","moda","modelo","moho","mojar","molde","moler","molino","momento","momia","monarca","moneda","monja","monto","moño","morada","morder","moreno","morir","morro","morsa","mortal","mosca","mostrar","motivo","mover","móvil","mozo","mucho","mudar","mueble","muela","muerte","muestra","mugre","mujer","mula","muleta","multa","mundo","muñeca","mural","muro","músculo","museo","musgo","música","muslo","nácar","nación","nadar","naipe","naranja","nariz","narrar","nasal","natal","nativo","natural","náusea","naval","nave","navidad","necio","néctar","negar","negocio","negro","neón","nervio","neto","neutro","nevar","nevera","nicho","nido","niebla","nieto","niñez","niño","nítido","nivel","nobleza","noche","nómina","noria","norma","norte","nota","noticia","novato","novela","novio","nube","nuca","núcleo","nudillo","nudo","nuera","nueve","nuez","nulo","número","nutria","oasis","obeso","obispo","objeto","obra","obrero","observar","obtener","obvio","oca","ocaso","océano","ochenta","ocho","ocio","ocre","octavo","octubre","oculto","ocupar","ocurrir","odiar","odio","odisea","oeste","ofensa","oferta","oficio","ofrecer","ogro","oído","oír","ojo","ola","oleada","olfato","olivo","olla","olmo","olor","olvido","ombligo","onda","onza","opaco","opción","ópera","opinar","oponer","optar","óptica","opuesto","oración","orador","oral","órbita","orca","orden","oreja","órgano","orgía","orgullo","oriente","origen","orilla","oro","orquesta","oruga","osadía","oscuro","osezno","oso","ostra","otoño","otro","oveja","óvulo","óxido","oxígeno","oyente","ozono","pacto","padre","paella","página","pago","país","pájaro","palabra","palco","paleta","pálido","palma","paloma","palpar","pan","panal","pánico","pantera","pañuelo","papá","papel","papilla","paquete","parar","parcela","pared","parir","paro","párpado","parque","párrafo","parte","pasar","paseo","pasión","paso","pasta","pata","patio","patria","pausa","pauta","pavo","payaso","peatón","pecado","pecera","pecho","pedal","pedir","pegar","peine","pelar","peldaño","pelea","peligro","pellejo","pelo","peluca","pena","pensar","peñón","peón","peor","pepino","pequeño","pera","percha","perder","pereza","perfil","perico","perla","permiso","perro","persona","pesa","pesca","pésimo","pestaña","pétalo","petróleo","pez","pezuña","picar","pichón","pie","piedra","pierna","pieza","pijama","pilar","piloto","pimienta","pino","pintor","pinza","piña","piojo","pipa","pirata","pisar","piscina","piso","pista","pitón","pizca","placa","plan","plata","playa","plaza","pleito","pleno","plomo","pluma","plural","pobre","poco","poder","podio","poema","poesía","poeta","polen","policía","pollo","polvo","pomada","pomelo","pomo","pompa","poner","porción","portal","posada","poseer","posible","poste","potencia","potro","pozo","prado","precoz","pregunta","premio","prensa","preso","previo","primo","príncipe","prisión","privar","proa","probar","proceso","producto","proeza","profesor","programa","prole","promesa","pronto","propio","próximo","prueba","público","puchero","pudor","pueblo","puerta","puesto","pulga","pulir","pulmón","pulpo","pulso","puma","punto","puñal","puño","pupa","pupila","puré","quedar","queja","quemar","querer","queso","quieto","química","quince","quitar","rábano","rabia","rabo","ración","radical","raíz","rama","rampa","rancho","rango","rapaz","rápido","rapto","rasgo","raspa","rato","rayo","raza","razón","reacción","realidad","rebaño","rebote","recaer","receta","rechazo","recoger","recreo","recto","recurso","red","redondo","reducir","reflejo","reforma","refrán","refugio","regalo","regir","regla","regreso","rehén","reino","reír","reja","relato","relevo","relieve","relleno","reloj","remar","remedio","remo","rencor","rendir","renta","reparto","repetir","reposo","reptil","res","rescate","resina","respeto","resto","resumen","retiro","retorno","retrato","reunir","revés","revista","rey","rezar","rico","riego","rienda","riesgo","rifa","rígido","rigor","rincón","riñón","río","riqueza","risa","ritmo","rito","rizo","roble","roce","rociar","rodar","rodeo","rodilla","roer","rojizo","rojo","romero","romper","ron","ronco","ronda","ropa","ropero","rosa","rosca","rostro","rotar","rubí","rubor","rudo","rueda","rugir","ruido","ruina","ruleta","rulo","rumbo","rumor","ruptura","ruta","rutina","sábado","saber","sabio","sable","sacar","sagaz","sagrado","sala","saldo","salero","salir","salmón","salón","salsa","salto","salud","salvar","samba","sanción","sandía","sanear","sangre","sanidad","sano","santo","sapo","saque","sardina","sartén","sastre","satán","sauna","saxofón","sección","seco","secreto","secta","sed","seguir","seis","sello","selva","semana","semilla","senda","sensor","señal","señor","separar","sepia","sequía","ser","serie","sermón","servir","sesenta","sesión","seta","setenta","severo","sexo","sexto","sidra","siesta","siete","siglo","signo","sílaba","silbar","silencio","silla","símbolo","simio","sirena","sistema","sitio","situar","sobre","socio","sodio","sol","solapa","soldado","soledad","sólido","soltar","solución","sombra","sondeo","sonido","sonoro","sonrisa","sopa","soplar","soporte","sordo","sorpresa","sorteo","sostén","sótano","suave","subir","suceso","sudor","suegra","suelo","sueño","suerte","sufrir","sujeto","sultán","sumar","superar","suplir","suponer","supremo","sur","surco","sureño","surgir","susto","sutil","tabaco","tabique","tabla","tabú","taco","tacto","tajo","talar","talco","talento","talla","talón","tamaño","tambor","tango","tanque","tapa","tapete","tapia","tapón","taquilla","tarde","tarea","tarifa","tarjeta","tarot","tarro","tarta","tatuaje","tauro","taza","tazón","teatro","techo","tecla","técnica","tejado","tejer","tejido","tela","teléfono","tema","temor","templo","tenaz","tender","tener","tenis","tenso","teoría","terapia","terco","término","ternura","terror","tesis","tesoro","testigo","tetera","texto","tez","tibio","tiburón","tiempo","tienda","tierra","tieso","tigre","tijera","tilde","timbre","tímido","timo","tinta","tío","típico","tipo","tira","tirón","titán","títere","título","tiza","toalla","tobillo","tocar","tocino","todo","toga","toldo","tomar","tono","tonto","topar","tope","toque","tórax","torero","tormenta","torneo","toro","torpedo","torre","torso","tortuga","tos","tosco","toser","tóxico","trabajo","tractor","traer","tráfico","trago","traje","tramo","trance","trato","trauma","trazar","trébol","tregua","treinta","tren","trepar","tres","tribu","trigo","tripa","triste","triunfo","trofeo","trompa","tronco","tropa","trote","trozo","truco","trueno","trufa","tubería","tubo","tuerto","tumba","tumor","túnel","túnica","turbina","turismo","turno","tutor","ubicar","úlcera","umbral","unidad","unir","universo","uno","untar","uña","urbano","urbe","urgente","urna","usar","usuario","útil","utopía","uva","vaca","vacío","vacuna","vagar","vago","vaina","vajilla","vale","válido","valle","valor","válvula","vampiro","vara","variar","varón","vaso","vecino","vector","vehículo","veinte","vejez","vela","velero","veloz","vena","vencer","venda","veneno","vengar","venir","venta","venus","ver","verano","verbo","verde","vereda","verja","verso","verter","vía","viaje","vibrar","vicio","víctima","vida","vídeo","vidrio","viejo","viernes","vigor","vil","villa","vinagre","vino","viñedo","violín","viral","virgo","virtud","visor","víspera","vista","vitamina","viudo","vivaz","vivero","vivir","vivo","volcán","volumen","volver","voraz","votar","voto","voz","vuelo","vulgar","yacer","yate","yegua","yema","yerno","yeso","yodo","yoga","yogur","zafiro","zanja","zapato","zarza","zona","zorro","zumo","zurdo"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["あいこくしん","あいさつ","あいだ","あおぞら","あかちゃん","あきる","あけがた","あける","あこがれる","あさい","あさひ","あしあと","あじわう","あずかる","あずき","あそぶ","あたえる","あたためる","あたりまえ","あたる","あつい","あつかう","あっしゅく","あつまり","あつめる","あてな","あてはまる","あひる","あぶら","あぶる","あふれる","あまい","あまど","あまやかす","あまり","あみもの","あめりか","あやまる","あゆむ","あらいぐま","あらし","あらすじ","あらためる","あらゆる","あらわす","ありがとう","あわせる","あわてる","あんい","あんがい","あんこ","あんぜん","あんてい","あんない","あんまり","いいだす","いおん","いがい","いがく","いきおい","いきなり","いきもの","いきる","いくじ","いくぶん","いけばな","いけん","いこう","いこく","いこつ","いさましい","いさん","いしき","いじゅう","いじょう","いじわる","いずみ","いずれ","いせい","いせえび","いせかい","いせき","いぜん","いそうろう","いそがしい","いだい","いだく","いたずら","いたみ","いたりあ","いちおう","いちじ","いちど","いちば","いちぶ","いちりゅう","いつか","いっしゅん","いっせい","いっそう","いったん","いっち","いってい","いっぽう","いてざ","いてん","いどう","いとこ","いない","いなか","いねむり","いのち","いのる","いはつ","いばる","いはん","いびき","いひん","いふく","いへん","いほう","いみん","いもうと","いもたれ","いもり","いやがる","いやす","いよかん","いよく","いらい","いらすと","いりぐち","いりょう","いれい","いれもの","いれる","いろえんぴつ","いわい","いわう","いわかん","いわば","いわゆる","いんげんまめ","いんさつ","いんしょう","いんよう","うえき","うえる","うおざ","うがい","うかぶ","うかべる","うきわ","うくらいな","うくれれ","うけたまわる","うけつけ","うけとる","うけもつ","うける","うごかす","うごく","うこん","うさぎ","うしなう","うしろがみ","うすい","うすぎ","うすぐらい","うすめる","うせつ","うちあわせ","うちがわ","うちき","うちゅう","うっかり","うつくしい","うったえる","うつる","うどん","うなぎ","うなじ","うなずく","うなる","うねる","うのう","うぶげ","うぶごえ","うまれる","うめる","うもう","うやまう","うよく","うらがえす","うらぐち","うらない","うりあげ","うりきれ","うるさい","うれしい","うれゆき","うれる","うろこ","うわき","うわさ","うんこう","うんちん","うんてん","うんどう","えいえん","えいが","えいきょう","えいご","えいせい","えいぶん","えいよう","えいわ","えおり","えがお","えがく","えきたい","えくせる","えしゃく","えすて","えつらん","えのぐ","えほうまき","えほん","えまき","えもじ","えもの","えらい","えらぶ","えりあ","えんえん","えんかい","えんぎ","えんげき","えんしゅう","えんぜつ","えんそく","えんちょう","えんとつ","おいかける","おいこす","おいしい","おいつく","おうえん","おうさま","おうじ","おうせつ","おうたい","おうふく","おうべい","おうよう","おえる","おおい","おおう","おおどおり","おおや","おおよそ","おかえり","おかず","おがむ","おかわり","おぎなう","おきる","おくさま","おくじょう","おくりがな","おくる","おくれる","おこす","おこなう","おこる","おさえる","おさない","おさめる","おしいれ","おしえる","おじぎ","おじさん","おしゃれ","おそらく","おそわる","おたがい","おたく","おだやか","おちつく","おっと","おつり","おでかけ","おとしもの","おとなしい","おどり","おどろかす","おばさん","おまいり","おめでとう","おもいで","おもう","おもたい","おもちゃ","おやつ","おやゆび","およぼす","おらんだ","おろす","おんがく","おんけい","おんしゃ","おんせん","おんだん","おんちゅう","おんどけい","かあつ","かいが","がいき","がいけん","がいこう","かいさつ","かいしゃ","かいすいよく","かいぜん","かいぞうど","かいつう","かいてん","かいとう","かいふく","がいへき","かいほう","かいよう","がいらい","かいわ","かえる","かおり","かかえる","かがく","かがし","かがみ","かくご","かくとく","かざる","がぞう","かたい","かたち","がちょう","がっきゅう","がっこう","がっさん","がっしょう","かなざわし","かのう","がはく","かぶか","かほう","かほご","かまう","かまぼこ","かめれおん","かゆい","かようび","からい","かるい","かろう","かわく","かわら","がんか","かんけい","かんこう","かんしゃ","かんそう","かんたん","かんち","がんばる","きあい","きあつ","きいろ","ぎいん","きうい","きうん","きえる","きおう","きおく","きおち","きおん","きかい","きかく","きかんしゃ","ききて","きくばり","きくらげ","きけんせい","きこう","きこえる","きこく","きさい","きさく","きさま","きさらぎ","ぎじかがく","ぎしき","ぎじたいけん","ぎじにってい","ぎじゅつしゃ","きすう","きせい","きせき","きせつ","きそう","きぞく","きぞん","きたえる","きちょう","きつえん","ぎっちり","きつつき","きつね","きてい","きどう","きどく","きない","きなが","きなこ","きぬごし","きねん","きのう","きのした","きはく","きびしい","きひん","きふく","きぶん","きぼう","きほん","きまる","きみつ","きむずかしい","きめる","きもだめし","きもち","きもの","きゃく","きやく","ぎゅうにく","きよう","きょうりゅう","きらい","きらく","きりん","きれい","きれつ","きろく","ぎろん","きわめる","ぎんいろ","きんかくじ","きんじょ","きんようび","ぐあい","くいず","くうかん","くうき","くうぐん","くうこう","ぐうせい","くうそう","ぐうたら","くうふく","くうぼ","くかん","くきょう","くげん","ぐこう","くさい","くさき","くさばな","くさる","くしゃみ","くしょう","くすのき","くすりゆび","くせげ","くせん","ぐたいてき","くださる","くたびれる","くちこみ","くちさき","くつした","ぐっすり","くつろぐ","くとうてん","くどく","くなん","くねくね","くのう","くふう","くみあわせ","くみたてる","くめる","くやくしょ","くらす","くらべる","くるま","くれる","くろう","くわしい","ぐんかん","ぐんしょく","ぐんたい","ぐんて","けあな","けいかく","けいけん","けいこ","けいさつ","げいじゅつ","けいたい","げいのうじん","けいれき","けいろ","けおとす","けおりもの","げきか","げきげん","げきだん","げきちん","げきとつ","げきは","げきやく","げこう","げこくじょう","げざい","けさき","げざん","けしき","けしごむ","けしょう","げすと","けたば","けちゃっぷ","けちらす","けつあつ","けつい","けつえき","けっこん","けつじょ","けっせき","けってい","けつまつ","げつようび","げつれい","けつろん","げどく","けとばす","けとる","けなげ","けなす","けなみ","けぬき","げねつ","けねん","けはい","げひん","けぶかい","げぼく","けまり","けみかる","けむし","けむり","けもの","けらい","けろけろ","けわしい","けんい","けんえつ","けんお","けんか","げんき","けんげん","けんこう","けんさく","けんしゅう","けんすう","げんそう","けんちく","けんてい","けんとう","けんない","けんにん","げんぶつ","けんま","けんみん","けんめい","けんらん","けんり","こあくま","こいぬ","こいびと","ごうい","こうえん","こうおん","こうかん","ごうきゅう","ごうけい","こうこう","こうさい","こうじ","こうすい","ごうせい","こうそく","こうたい","こうちゃ","こうつう","こうてい","こうどう","こうない","こうはい","ごうほう","ごうまん","こうもく","こうりつ","こえる","こおり","ごかい","ごがつ","ごかん","こくご","こくさい","こくとう","こくない","こくはく","こぐま","こけい","こける","ここのか","こころ","こさめ","こしつ","こすう","こせい","こせき","こぜん","こそだて","こたい","こたえる","こたつ","こちょう","こっか","こつこつ","こつばん","こつぶ","こてい","こてん","ことがら","ことし","ことば","ことり","こなごな","こねこね","このまま","このみ","このよ","ごはん","こひつじ","こふう","こふん","こぼれる","ごまあぶら","こまかい","ごますり","こまつな","こまる","こむぎこ","こもじ","こもち","こもの","こもん","こやく","こやま","こゆう","こゆび","こよい","こよう","こりる","これくしょん","ころっけ","こわもて","こわれる","こんいん","こんかい","こんき","こんしゅう","こんすい","こんだて","こんとん","こんなん","こんびに","こんぽん","こんまけ","こんや","こんれい","こんわく","ざいえき","さいかい","さいきん","ざいげん","ざいこ","さいしょ","さいせい","ざいたく","ざいちゅう","さいてき","ざいりょう","さうな","さかいし","さがす","さかな","さかみち","さがる","さぎょう","さくし","さくひん","さくら","さこく","さこつ","さずかる","ざせき","さたん","さつえい","ざつおん","ざっか","ざつがく","さっきょく","ざっし","さつじん","ざっそう","さつたば","さつまいも","さてい","さといも","さとう","さとおや","さとし","さとる","さのう","さばく","さびしい","さべつ","さほう","さほど","さます","さみしい","さみだれ","さむけ","さめる","さやえんどう","さゆう","さよう","さよく","さらだ","ざるそば","さわやか","さわる","さんいん","さんか","さんきゃく","さんこう","さんさい","ざんしょ","さんすう","さんせい","さんそ","さんち","さんま","さんみ","さんらん","しあい","しあげ","しあさって","しあわせ","しいく","しいん","しうち","しえい","しおけ","しかい","しかく","じかん","しごと","しすう","じだい","したうけ","したぎ","したて","したみ","しちょう","しちりん","しっかり","しつじ","しつもん","してい","してき","してつ","じてん","じどう","しなぎれ","しなもの","しなん","しねま","しねん","しのぐ","しのぶ","しはい","しばかり","しはつ","しはらい","しはん","しひょう","しふく","じぶん","しへい","しほう","しほん","しまう","しまる","しみん","しむける","じむしょ","しめい","しめる","しもん","しゃいん","しゃうん","しゃおん","じゃがいも","しやくしょ","しゃくほう","しゃけん","しゃこ","しゃざい","しゃしん","しゃせん","しゃそう","しゃたい","しゃちょう","しゃっきん","じゃま","しゃりん","しゃれい","じゆう","じゅうしょ","しゅくはく","じゅしん","しゅっせき","しゅみ","しゅらば","じゅんばん","しょうかい","しょくたく","しょっけん","しょどう","しょもつ","しらせる","しらべる","しんか","しんこう","じんじゃ","しんせいじ","しんちく","しんりん","すあげ","すあし","すあな","ずあん","すいえい","すいか","すいとう","ずいぶん","すいようび","すうがく","すうじつ","すうせん","すおどり","すきま","すくう","すくない","すける","すごい","すこし","ずさん","すずしい","すすむ","すすめる","すっかり","ずっしり","ずっと","すてき","すてる","すねる","すのこ","すはだ","すばらしい","ずひょう","ずぶぬれ","すぶり","すふれ","すべて","すべる","ずほう","すぼん","すまい","すめし","すもう","すやき","すらすら","するめ","すれちがう","すろっと","すわる","すんぜん","すんぽう","せあぶら","せいかつ","せいげん","せいじ","せいよう","せおう","せかいかん","せきにん","せきむ","せきゆ","せきらんうん","せけん","せこう","せすじ","せたい","せたけ","せっかく","せっきゃく","ぜっく","せっけん","せっこつ","せっさたくま","せつぞく","せつだん","せつでん","せっぱん","せつび","せつぶん","せつめい","せつりつ","せなか","せのび","せはば","せびろ","せぼね","せまい","せまる","せめる","せもたれ","せりふ","ぜんあく","せんい","せんえい","せんか","せんきょ","せんく","せんげん","ぜんご","せんさい","せんしゅ","せんすい","せんせい","せんぞ","せんたく","せんちょう","せんてい","せんとう","せんぬき","せんねん","せんぱい","ぜんぶ","ぜんぽう","せんむ","せんめんじょ","せんもん","せんやく","せんゆう","せんよう","ぜんら","ぜんりゃく","せんれい","せんろ","そあく","そいとげる","そいね","そうがんきょう","そうき","そうご","そうしん","そうだん","そうなん","そうび","そうめん","そうり","そえもの","そえん","そがい","そげき","そこう","そこそこ","そざい","そしな","そせい","そせん","そそぐ","そだてる","そつう","そつえん","そっかん","そつぎょう","そっけつ","そっこう","そっせん","そっと","そとがわ","そとづら","そなえる","そなた","そふぼ","そぼく","そぼろ","そまつ","そまる","そむく","そむりえ","そめる","そもそも","そよかぜ","そらまめ","そろう","そんかい","そんけい","そんざい","そんしつ","そんぞく","そんちょう","ぞんび","ぞんぶん","そんみん","たあい","たいいん","たいうん","たいえき","たいおう","だいがく","たいき","たいぐう","たいけん","たいこ","たいざい","だいじょうぶ","だいすき","たいせつ","たいそう","だいたい","たいちょう","たいてい","だいどころ","たいない","たいねつ","たいのう","たいはん","だいひょう","たいふう","たいへん","たいほ","たいまつばな","たいみんぐ","たいむ","たいめん","たいやき","たいよう","たいら","たいりょく","たいる","たいわん","たうえ","たえる","たおす","たおる","たおれる","たかい","たかね","たきび","たくさん","たこく","たこやき","たさい","たしざん","だじゃれ","たすける","たずさわる","たそがれ","たたかう","たたく","ただしい","たたみ","たちばな","だっかい","だっきゃく","だっこ","だっしゅつ","だったい","たてる","たとえる","たなばた","たにん","たぬき","たのしみ","たはつ","たぶん","たべる","たぼう","たまご","たまる","だむる","ためいき","ためす","ためる","たもつ","たやすい","たよる","たらす","たりきほんがん","たりょう","たりる","たると","たれる","たれんと","たろっと","たわむれる","だんあつ","たんい","たんおん","たんか","たんき","たんけん","たんご","たんさん","たんじょうび","だんせい","たんそく","たんたい","だんち","たんてい","たんとう","だんな","たんにん","だんねつ","たんのう","たんぴん","だんぼう","たんまつ","たんめい","だんれつ","だんろ","だんわ","ちあい","ちあん","ちいき","ちいさい","ちえん","ちかい","ちから","ちきゅう","ちきん","ちけいず","ちけん","ちこく","ちさい","ちしき","ちしりょう","ちせい","ちそう","ちたい","ちたん","ちちおや","ちつじょ","ちてき","ちてん","ちぬき","ちぬり","ちのう","ちひょう","ちへいせん","ちほう","ちまた","ちみつ","ちみどろ","ちめいど","ちゃんこなべ","ちゅうい","ちゆりょく","ちょうし","ちょさくけん","ちらし","ちらみ","ちりがみ","ちりょう","ちるど","ちわわ","ちんたい","ちんもく","ついか","ついたち","つうか","つうじょう","つうはん","つうわ","つかう","つかれる","つくね","つくる","つけね","つける","つごう","つたえる","つづく","つつじ","つつむ","つとめる","つながる","つなみ","つねづね","つのる","つぶす","つまらない","つまる","つみき","つめたい","つもり","つもる","つよい","つるぼ","つるみく","つわもの","つわり","てあし","てあて","てあみ","ていおん","ていか","ていき","ていけい","ていこく","ていさつ","ていし","ていせい","ていたい","ていど","ていねい","ていひょう","ていへん","ていぼう","てうち","ておくれ","てきとう","てくび","でこぼこ","てさぎょう","てさげ","てすり","てそう","てちがい","てちょう","てつがく","てつづき","でっぱ","てつぼう","てつや","でぬかえ","てぬき","てぬぐい","てのひら","てはい","てぶくろ","てふだ","てほどき","てほん","てまえ","てまきずし","てみじか","てみやげ","てらす","てれび","てわけ","てわたし","でんあつ","てんいん","てんかい","てんき","てんぐ","てんけん","てんごく","てんさい","てんし","てんすう","でんち","てんてき","てんとう","てんない","てんぷら","てんぼうだい","てんめつ","てんらんかい","でんりょく","でんわ","どあい","といれ","どうかん","とうきゅう","どうぐ","とうし","とうむぎ","とおい","とおか","とおく","とおす","とおる","とかい","とかす","ときおり","ときどき","とくい","とくしゅう","とくてん","とくに","とくべつ","とけい","とける","とこや","とさか","としょかん","とそう","とたん","とちゅう","とっきゅう","とっくん","とつぜん","とつにゅう","とどける","ととのえる","とない","となえる","となり","とのさま","とばす","どぶがわ","とほう","とまる","とめる","ともだち","ともる","どようび","とらえる","とんかつ","どんぶり","ないかく","ないこう","ないしょ","ないす","ないせん","ないそう","なおす","ながい","なくす","なげる","なこうど","なさけ","なたでここ","なっとう","なつやすみ","ななおし","なにごと","なにもの","なにわ","なのか","なふだ","なまいき","なまえ","なまみ","なみだ","なめらか","なめる","なやむ","ならう","ならび","ならぶ","なれる","なわとび","なわばり","にあう","にいがた","にうけ","におい","にかい","にがて","にきび","にくしみ","にくまん","にげる","にさんかたんそ","にしき","にせもの","にちじょう","にちようび","にっか","にっき","にっけい","にっこう","にっさん","にっしょく","にっすう","にっせき","にってい","になう","にほん","にまめ","にもつ","にやり","にゅういん","にりんしゃ","にわとり","にんい","にんか","にんき","にんげん","にんしき","にんずう","にんそう","にんたい","にんち","にんてい","にんにく","にんぷ","にんまり","にんむ","にんめい","にんよう","ぬいくぎ","ぬかす","ぬぐいとる","ぬぐう","ぬくもり","ぬすむ","ぬまえび","ぬめり","ぬらす","ぬんちゃく","ねあげ","ねいき","ねいる","ねいろ","ねぐせ","ねくたい","ねくら","ねこぜ","ねこむ","ねさげ","ねすごす","ねそべる","ねだん","ねつい","ねっしん","ねつぞう","ねったいぎょ","ねぶそく","ねふだ","ねぼう","ねほりはほり","ねまき","ねまわし","ねみみ","ねむい","ねむたい","ねもと","ねらう","ねわざ","ねんいり","ねんおし","ねんかん","ねんきん","ねんぐ","ねんざ","ねんし","ねんちゃく","ねんど","ねんぴ","ねんぶつ","ねんまつ","ねんりょう","ねんれい","のいず","のおづま","のがす","のきなみ","のこぎり","のこす","のこる","のせる","のぞく","のぞむ","のたまう","のちほど","のっく","のばす","のはら","のべる","のぼる","のみもの","のやま","のらいぬ","のらねこ","のりもの","のりゆき","のれん","のんき","ばあい","はあく","ばあさん","ばいか","ばいく","はいけん","はいご","はいしん","はいすい","はいせん","はいそう","はいち","ばいばい","はいれつ","はえる","はおる","はかい","ばかり","はかる","はくしゅ","はけん","はこぶ","はさみ","はさん","はしご","ばしょ","はしる","はせる","ぱそこん","はそん","はたん","はちみつ","はつおん","はっかく","はづき","はっきり","はっくつ","はっけん","はっこう","はっさん","はっしん","はったつ","はっちゅう","はってん","はっぴょう","はっぽう","はなす","はなび","はにかむ","はぶらし","はみがき","はむかう","はめつ","はやい","はやし","はらう","はろうぃん","はわい","はんい","はんえい","はんおん","はんかく","はんきょう","ばんぐみ","はんこ","はんしゃ","はんすう","はんだん","ぱんち","ぱんつ","はんてい","はんとし","はんのう","はんぱ","はんぶん","はんぺん","はんぼうき","はんめい","はんらん","はんろん","ひいき","ひうん","ひえる","ひかく","ひかり","ひかる","ひかん","ひくい","ひけつ","ひこうき","ひこく","ひさい","ひさしぶり","ひさん","びじゅつかん","ひしょ","ひそか","ひそむ","ひたむき","ひだり","ひたる","ひつぎ","ひっこし","ひっし","ひつじゅひん","ひっす","ひつぜん","ぴったり","ぴっちり","ひつよう","ひてい","ひとごみ","ひなまつり","ひなん","ひねる","ひはん","ひびく","ひひょう","ひほう","ひまわり","ひまん","ひみつ","ひめい","ひめじし","ひやけ","ひやす","ひよう","びょうき","ひらがな","ひらく","ひりつ","ひりょう","ひるま","ひるやすみ","ひれい","ひろい","ひろう","ひろき","ひろゆき","ひんかく","ひんけつ","ひんこん","ひんしゅ","ひんそう","ぴんち","ひんぱん","びんぼう","ふあん","ふいうち","ふうけい","ふうせん","ぷうたろう","ふうとう","ふうふ","ふえる","ふおん","ふかい","ふきん","ふくざつ","ふくぶくろ","ふこう","ふさい","ふしぎ","ふじみ","ふすま","ふせい","ふせぐ","ふそく","ぶたにく","ふたん","ふちょう","ふつう","ふつか","ふっかつ","ふっき","ふっこく","ぶどう","ふとる","ふとん","ふのう","ふはい","ふひょう","ふへん","ふまん","ふみん","ふめつ","ふめん","ふよう","ふりこ","ふりる","ふるい","ふんいき","ぶんがく","ぶんぐ","ふんしつ","ぶんせき","ふんそう","ぶんぽう","へいあん","へいおん","へいがい","へいき","へいげん","へいこう","へいさ","へいしゃ","へいせつ","へいそ","へいたく","へいてん","へいねつ","へいわ","へきが","へこむ","べにいろ","べにしょうが","へらす","へんかん","べんきょう","べんごし","へんさい","へんたい","べんり","ほあん","ほいく","ぼうぎょ","ほうこく","ほうそう","ほうほう","ほうもん","ほうりつ","ほえる","ほおん","ほかん","ほきょう","ぼきん","ほくろ","ほけつ","ほけん","ほこう","ほこる","ほしい","ほしつ","ほしゅ","ほしょう","ほせい","ほそい","ほそく","ほたて","ほたる","ぽちぶくろ","ほっきょく","ほっさ","ほったん","ほとんど","ほめる","ほんい","ほんき","ほんけ","ほんしつ","ほんやく","まいにち","まかい","まかせる","まがる","まける","まこと","まさつ","まじめ","ますく","まぜる","まつり","まとめ","まなぶ","まぬけ","まねく","まほう","まもる","まゆげ","まよう","まろやか","まわす","まわり","まわる","まんが","まんきつ","まんぞく","まんなか","みいら","みうち","みえる","みがく","みかた","みかん","みけん","みこん","みじかい","みすい","みすえる","みせる","みっか","みつかる","みつける","みてい","みとめる","みなと","みなみかさい","みねらる","みのう","みのがす","みほん","みもと","みやげ","みらい","みりょく","みわく","みんか","みんぞく","むいか","むえき","むえん","むかい","むかう","むかえ","むかし","むぎちゃ","むける","むげん","むさぼる","むしあつい","むしば","むじゅん","むしろ","むすう","むすこ","むすぶ","むすめ","むせる","むせん","むちゅう","むなしい","むのう","むやみ","むよう","むらさき","むりょう","むろん","めいあん","めいうん","めいえん","めいかく","めいきょく","めいさい","めいし","めいそう","めいぶつ","めいれい","めいわく","めぐまれる","めざす","めした","めずらしい","めだつ","めまい","めやす","めんきょ","めんせき","めんどう","もうしあげる","もうどうけん","もえる","もくし","もくてき","もくようび","もちろん","もどる","もらう","もんく","もんだい","やおや","やける","やさい","やさしい","やすい","やすたろう","やすみ","やせる","やそう","やたい","やちん","やっと","やっぱり","やぶる","やめる","ややこしい","やよい","やわらかい","ゆうき","ゆうびんきょく","ゆうべ","ゆうめい","ゆけつ","ゆしゅつ","ゆせん","ゆそう","ゆたか","ゆちゃく","ゆでる","ゆにゅう","ゆびわ","ゆらい","ゆれる","ようい","ようか","ようきゅう","ようじ","ようす","ようちえん","よかぜ","よかん","よきん","よくせい","よくぼう","よけい","よごれる","よさん","よしゅう","よそう","よそく","よっか","よてい","よどがわく","よねつ","よやく","よゆう","よろこぶ","よろしい","らいう","らくがき","らくご","らくさつ","らくだ","らしんばん","らせん","らぞく","らたい","らっか","られつ","りえき","りかい","りきさく","りきせつ","りくぐん","りくつ","りけん","りこう","りせい","りそう","りそく","りてん","りねん","りゆう","りゅうがく","りよう","りょうり","りょかん","りょくちゃ","りょこう","りりく","りれき","りろん","りんご","るいけい","るいさい","るいじ","るいせき","るすばん","るりがわら","れいかん","れいぎ","れいせい","れいぞうこ","れいとう","れいぼう","れきし","れきだい","れんあい","れんけい","れんこん","れんさい","れんしゅう","れんぞく","れんらく","ろうか","ろうご","ろうじん","ろうそく","ろくが","ろこつ","ろじうら","ろしゅつ","ろせん","ろてん","ろめん","ろれつ","ろんぎ","ろんぱ","ろんぶん","ろんり","わかす","わかめ","わかやま","わかれる","わしつ","わじまし","わすれもの","わらう","われる"]'
      );
    },
    function (e) {
      e.exports = JSON.parse(
        '["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"]'
      );
    },
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    ,
    function (e, t, r) {
      const { fetchAll: n } = r(154);
      t.handler = async (e, t, r) => {
        let i = await n('twitter');
        return (i = JSON.stringify(i)), { statusCode: 200, body: i };
      };
    },
  ])
);