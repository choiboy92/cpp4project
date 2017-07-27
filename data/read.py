#!/usr/bin/python

import os
import struct


def main():

    fname = "rnase.mtz"

    l  = os.path.getsize(fname)
    print "file length = ",l

    fh = open(fname,'rb')
    s1 = fh.read(4)
    s2 = fh.read(4)
    fh.close()

    print "First bytes"
    for i in range(len(s1)):
        print str(ord(s1[i]))

    for i in range(len(s2)):
        print str(ord(s2[i]))

    n1 = struct.unpack(">I",s2)[0]
    n2 = struct.unpack("<I",s2)[0]
    print "n1=",n1,",  n2=",n2,",  offset=",4*n2-4

    fh = open(fname,'rb')
    fh.seek ( 4*n2-4 )
    s3 = fh.read(16)
    fh.close()
    print s3

if __name__ == "__main__":
        main()
